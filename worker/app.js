import 'dotenv/config'; 
import utils from './src/utils.js';
import fs from "fs";

const api_url = 'http://localhost:8000/';
const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

async function workitout() {
  try {
    for (const table of config) {
      utils.writeLog(`🔄 Processing field: ${table.field}`, "config");

      // Récupération des données - pour les startups, on récupère d'abord la liste puis les détails
      let data;
      if (table.field === 'startups') {
        const startupsList = await utils.getByField(table.field);
        utils.writeLog(`📋 Found ${startupsList.length} startups in list, fetching details...`, table.field);
        
        // Récupérer les détails de chaque startup avec limitation de concurrence
        const DETAIL_BATCH_SIZE = 3; // Limiter les requêtes de détails simultanées
        data = [];
        
        for (let i = 0; i < startupsList.length; i += DETAIL_BATCH_SIZE) {
          const batch = startupsList.slice(i, i + DETAIL_BATCH_SIZE);
          const batchDetails = await Promise.all(
            batch.map(startup => utils.getStartupDetails(startup.id))
          );
          data.push(...batchDetails);
          
          // Petite pause entre les batches de récupération
          if (i + DETAIL_BATCH_SIZE < startupsList.length) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
        
        utils.writeLog(`✅ Fetched details for ${data.length} startups`, table.field);
      } else {
        data = await utils.getByField(table.field);
      }

      const localResponse = await fetch(api_url + table.field);
      const localData = await localResponse.json();

      // Transformation avec id_legacy
      const transformedData = data.map(({ id, ...rest }) => ({
        ...rest,
        id_legacy: id
      }));

      // Set pour une recherche O(1)
      const existingLegacyIds = new Set(localData.map(p => p.id_legacy));

      // Filtrage des nouveaux éléments
      const newItems = transformedData.filter(p => !existingLegacyIds.has(p.id_legacy));
      const skippedItems = transformedData.filter(p => existingLegacyIds.has(p.id_legacy));

      // Log des éléments ignorés
      skippedItems.forEach(p => {
        utils.writeLog(
          `ℹ️ ${table.field} already existing (id_legacy=${p.id_legacy}, name=${p.name || "N/A"})`,
          table.field
        );
      });

      utils.writeLog(`📊 ${table.field}: ${newItems.length} new items, ${skippedItems.length} skipped`, table.field);

      // Traitement des nouveaux éléments avec limitation de concurrence
      const BATCH_SIZE = 3; // Réduire encore plus pour éviter la surcharge
      for (let i = 0; i < newItems.length; i += BATCH_SIZE) {
        const batch = newItems.slice(i, i + BATCH_SIZE);
        
        await Promise.all(batch.map(async (item) => {
          try {
            // Gestion des images pour les éléments normaux (pas les startups)
            if (table.image === true && table.field !== 'startups') {
              const image = await utils.getImageByFieldId(table.field, item.id_legacy);
              if (image) {
                item.image = image;
              }
            }

            // Gestion spéciale pour les startups avec founders
            if (table.field === 'startups') {
              utils.writeLog(`🔍 Debug startup ${item.id_legacy}: founders=${JSON.stringify(item.founders)}`, 'startups');
              
              if (item.founders && Array.isArray(item.founders) && item.founders.length > 0) {
                utils.writeLog(`🔄 Processing ${item.founders.length} founders for startup ${item.id_legacy}`, 'startups');
                item.founders = await utils.processFounders(item.founders, item.id_legacy);
                utils.writeLog(`✅ Processed founders: ${JSON.stringify(item.founders)}`, 'startups');
              } else {
                utils.writeLog(`⚠️ No founders found for startup ${item.id_legacy}`, 'startups');
                item.founders = []; // S'assurer que le champ existe même vide
              }
            }

            // Debug: afficher l'objet complet avant envoi (seulement les premières propriétés)
            const debugItem = { ...item };
            if (debugItem.founders) {
              debugItem.founders = `[${debugItem.founders.length} founders]`;
            }
            utils.writeLog(`🚀 Sending to API: ${JSON.stringify(debugItem)}`, table.field);
            
            await utils.addInField(table.field, item);
          } catch (itemError) {
            utils.writeLog(`❌ Error processing item ${item.id_legacy}: ${itemError}`, table.field);
          }
        }));
        
        // Pause plus longue entre les batches pour éviter la surcharge
        if (i + BATCH_SIZE < newItems.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      utils.writeLog(`✅ ${table.field} processing completed`, table.field);
    }
    
    utils.writeLog("🎉 Migration completed successfully", "config");
  } catch (error) {
    utils.writeLog("❌ Critical error: " + error.message, "ancientDataBase");
    throw error;
  }
}

workitout().catch(error => {
  console.error("Migration failed:", error);
  process.exit(1);
});