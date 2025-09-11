import 'dotenv/config'; 
import fs from 'fs';
import path from 'path';

// Configuration
const ancient_api_key = process.env.ANCIENT_API_KEY;
const ancient_api_url = process.env.ANCIENT_API_URL;
const api_url = 'http://localhost:8000/';

// Création du dossier de logs
const logDir = path.resolve('./logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// ----------
// -- Logs --
// ----------

function writeLog(message, from) {
  const logFile = path.join(logDir, `${from}.log`);
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
}

// -------------------
// -- Data cleaning --
// -------------------

function cleanBase64(base64String) {
  if (!base64String || typeof base64String !== 'string') {
    return base64String;
  }

  return base64String
    .replace(/\0/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
}

function cleanObjectData(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => cleanObjectData(item));
  }
  
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === 'founders') {
      // Ne pas nettoyer les founders, les garder tels quels
      cleaned[key] = value;
    } else if (typeof value === 'string') {
      cleaned[key] = cleanBase64(value);
    } else if (typeof value === 'object' && value !== null) {
      cleaned[key] = cleanObjectData(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

// --------------------------
// -- API Request helpers --
// --------------------------

function createHeaders() {
  const headers = new Headers();
  headers.append("X-Group-Authorization", ancient_api_key);
  return headers;
}

async function makeRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: createHeaders(),
    redirect: "follow"
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response;
}

// ----------------------
// -- Core functions --
// ----------------------

async function getByField(field) {
  try {
    const response = await makeRequest(ancient_api_url + field, { method: "GET" });
    return await response.json();
  } catch (error) {
    writeLog(`❌ Error fetching ${field}: ${error.message}`, field);
    throw error;
  }
}

async function getStartupDetails(startupId) {
  try {
    const response = await makeRequest(`${ancient_api_url}startups/${startupId}`, { method: "GET" });
    const startup = await response.json();
    writeLog(`✅ Fetched details for startup ${startupId}: ${startup.name}`, 'startups');
    return startup;
  } catch (error) {
    writeLog(`❌ Error fetching startup details for ID ${startupId}: ${error.message}`, 'startups');
    throw error;
  }
}

async function getImageByFieldId(field, id) {
  try {
    const response = await makeRequest(`${ancient_api_url}${field}/${id}/image`, { method: "GET" });
    const imageData = await response.text();
    return cleanBase64(imageData);
  } catch (error) {
    writeLog(`⚠️ Could not get image for ${field} id=${id}: ${error.message}`, field);
    return null;
  }
}

async function getFounderImage(startupId, founderId) {
  try {
    const response = await makeRequest(
      `${ancient_api_url}startups/${startupId}/founders/${founderId}/image`, 
      { method: "GET" }
    );
    const imageData = await response.text();
    return cleanBase64(imageData);
  } catch (error) {
    writeLog(`⚠️ Could not get founder image for startup=${startupId}, founder=${founderId}: ${error.message}`, 'startups');
    return null;
  }
}

async function processFounders(founders, startupId) {
  if (!founders || !Array.isArray(founders)) {
    return [];
  }

  const processedFounders = await Promise.all(
    founders.map(async (founder) => {
      if (!founder || !founder.id) {
        writeLog(`⚠️ Founder without ID found for startup ${startupId}`, 'startups');
        return null;
      }

      // Créer le nouvel objet founder avec id_legacy et sans startup_id
      const founderWithLegacyId = {
        name: founder.name || 'Unknown',
        id_legacy: founder.id
        // On ne copie PAS startup_id
      };

      // Récupération de l'image du founder
      try {
        const founderImage = await getFounderImage(startupId, founder.id);
        founderWithLegacyId.image = founderImage; // null si pas d'image
      } catch (error) {
        writeLog(`❌ Error getting image for founder ${founder.id}: ${error.message}`, 'startups');
        founderWithLegacyId.image = null;
      }

      writeLog(`✅ Processed founder: ${JSON.stringify(founderWithLegacyId)}`, 'startups');
      return founderWithLegacyId;
    })
  );

  // Filtrer les founders null
  return processedFounders.filter(founder => founder !== null);
}

async function addInField(field, item) {
  const cleanedItem = cleanObjectData(item);
  
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cleanedItem),
    redirect: "follow"
  };

  try {
    const response = await fetch(api_url + field, requestOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.text();
    writeLog(`✅ ${field} created successfully: ${cleanedItem.name || cleanedItem.id_legacy}`, field);
    return result;
  } catch (error) {
    writeLog(`❌ Error creating ${field} (id_legacy=${cleanedItem.id_legacy}): ${error.message}`, field);
    throw error;
  }
}

export default { 
  writeLog, 
  getByField,
  getStartupDetails,
  addInField, 
  getImageByFieldId, 
  getFounderImage,
  processFounders 
};