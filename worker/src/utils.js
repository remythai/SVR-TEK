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

const foreignKeyCache = {};

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

// ---------------------------------
// -- Foreign Key Resolution --
// ---------------------------------

async function getForeignKeyMapping(tableName) {
  if (foreignKeyCache[tableName]) {
    return foreignKeyCache[tableName];
  }

  try {
    const response = await fetch(`${api_url}${tableName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${tableName}: ${response.status}`);
    }
    
    const data = await response.json();
    const mapping = {};
    
    data.forEach(item => {
      if (item.id_legacy) {
        mapping[item.id_legacy] = item.id;
      }
    });
    
    foreignKeyCache[tableName] = mapping;
    writeLog(`🔄 Cached ${Object.keys(mapping).length} mappings for table ${tableName}`, 'foreign_keys');
    
    return mapping;
  } catch (error) {
    writeLog(`❌ Error getting foreign key mapping for ${tableName}: ${error.message}`, 'foreign_keys');
    return {};
  }
}

async function resolveForeignKeys(item, currentField) {
  if (!item || typeof item !== 'object') {
    return item;
  }

  const resolvedItem = { ...item };
  
  for (const [key, value] of Object.entries(resolvedItem)) {
    if (key.endsWith('_id') && value !== null && value !== undefined) {
      const fieldName = key.slice(0, -3);
      const tableName = fieldName + 's';
      
      writeLog(`🔍 Found foreign key: ${key}=${value} -> looking in table ${tableName}`, 'foreign_keys');
      
      try {
        const mapping = await getForeignKeyMapping(tableName);
        
        if (mapping[value]) {
          const newId = mapping[value];
          resolvedItem[key] = newId;
          writeLog(`✅ Resolved FK: ${key} ${value} -> ${newId}`, 'foreign_keys');
        } else {
          writeLog(`⚠️ Could not resolve FK: ${key}=${value} not found in ${tableName}`, 'foreign_keys');
        }
      } catch (error) {
        writeLog(`❌ Error resolving FK ${key}: ${error.message}`, 'foreign_keys');
      }
    }
  }
  
  return resolvedItem;
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

async function getDetailsByFieldId(field, id) {
  try {
    const response = await makeRequest(`${ancient_api_url}${field}/${id}`, { method: "GET" });
    const details = await response.json();
    writeLog(`✅ Fetched details for ${field} ${id}: ${details.name || 'N/A'}`, field);
    return details;
  } catch (error) {
    writeLog(`❌ Error fetching ${field} details for ID ${id}: ${error.message}`, field);
    return {
      id: id,
      name: `${field}_${id}_ERROR`,
      error: true,
      errorMessage: error.message
    };
  }
}

async function getImageByFieldId(field, id) {
  try {
    const response = await makeRequest(`${ancient_api_url}${field}/${id}/image`, { method: "GET" });
    const imageData = await response.text();
    const cleanedImage = cleanBase64(imageData);
    writeLog(`✅ Image retrieved for ${field} id=${id}: ${cleanedImage ? 'has data' : 'null/empty'}`, field);
    return cleanedImage;
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
    const cleanedImage = cleanBase64(imageData);
    writeLog(`✅ Founder image retrieved for startup=${startupId}, founder=${founderId}: ${cleanedImage ? 'has data' : 'null/empty'}`, 'startups');
    return cleanedImage;
  } catch (error) {
    writeLog(`⚠️ Could not get founder image for startup=${startupId}, founder=${founderId}: ${error.message}`, 'startups');
    return null;
  }
}

async function processFounders(founders, startupId) {
  if (!founders || !Array.isArray(founders)) {
    return [];
  }

  const processedFounders = [];
  
  for (let i = 0; i < founders.length; i++) {
    const founder = founders[i];
    
    if (!founder || !founder.id) {
      writeLog(`⚠️ Founder without ID found for startup ${startupId}`, 'startups');
      continue;
    }

    const founderWithLegacyId = {
      name: founder.name || 'Unknown',
      id_legacy: founder.id
    };

    try {
      const founderImage = await getFounderImage(startupId, founder.id);
      founderWithLegacyId.image = founderImage;
    } catch (error) {
      writeLog(`❌ Error getting image for founder ${founder.id}: ${error.message}`, 'startups');
      founderWithLegacyId.image = null;
    }

    writeLog(`✅ Processed founder ${i+1}/${founders.length}: name=${founderWithLegacyId.name}, id_legacy=${founderWithLegacyId.id_legacy}, image=${founderWithLegacyId.image ? 'has data' : 'null'}`, 'startups');
    processedFounders.push(founderWithLegacyId);
    
    if (i < founders.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  return processedFounders;
}

async function addInField(field, item) {
  const itemWithResolvedFKs = await resolveForeignKeys(item, field);
  const cleanedItem = cleanObjectData(itemWithResolvedFKs);
  
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
  getDetailsByFieldId,
  addInField, 
  getImageByFieldId, 
  getFounderImage,
  processFounders,
  resolveForeignKeys,
  getForeignKeyMapping
};