import 'dotenv/config'; 
import utils from './src/utils.js';
import fs from "fs";

const api_url = 'http://localhost:8000/';
const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

async function workitout() {
  try {
    for (const table of config) {
      utils.writeLog(`🔄 Processing field: ${table.field}`, "config");

      const itemsList = await utils.getByField(table.field);
      utils.writeLog(`📋 Found ${itemsList.length} ${table.field} in list, fetching complete details...`, table.field);
      
      let data = [];
      
      for (let i = 0; i < itemsList.length; i++) {
        const item = itemsList[i];
        utils.writeLog(`🔄 Processing ${table.field} ${i+1}/${itemsList.length} - ID: ${item.id}`, table.field);
        
        const itemDetails = await utils.getDetailsByFieldId(table.field, item.id);
        
        if (itemDetails.error) {
          utils.writeLog(`⚠️ ${table.field} ${item.id} failed: ${itemDetails.errorMessage}`, table.field);
        } else {
          data.push(itemDetails);
        }
        
        if (i < itemsList.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      
      utils.writeLog(`✅ Fetched complete details for ${data.length} ${table.field} (${itemsList.length - data.length} failed)`, table.field);

      const localResponse = await fetch(api_url + table.field);
      const localData = await localResponse.json();

      const transformedData = data.map(({ id, ...rest }) => ({
        ...rest,
        id_legacy: id
      }));

      const existingLegacyIds = new Set(localData.map(p => p.id_legacy));
      const newItems = transformedData.filter(p => !existingLegacyIds.has(p.id_legacy));
      const skippedItems = transformedData.filter(p => existingLegacyIds.has(p.id_legacy));

      skippedItems.forEach(p => {
        utils.writeLog(
          `ℹ️ ${table.field} already existing (id_legacy=${p.id_legacy}, name=${p.name || "N/A"})`,
          table.field
        );
      });

      utils.writeLog(`📊 ${table.field}: ${newItems.length} new items, ${skippedItems.length} skipped`, table.field);

      for (let i = 0; i < newItems.length; i++) {
        const item = newItems[i];
        utils.writeLog(`🔄 Processing item ${i+1}/${newItems.length} - ${item.id_legacy} (${item.name || 'Unknown'})`, table.field);
        
        try {
          if (table.image === true && table.field !== 'startups') {
            const image = await utils.getImageByFieldId(table.field, item.id_legacy);
            if (image) {
              item.image = image;
            }
          }

          if (table.field === 'startups') {
            utils.writeLog(`🔍 Debug startup ${item.id_legacy}: founders count=${item.founders ? item.founders.length : 0}`, 'startups');
            
            if (item.founders && Array.isArray(item.founders) && item.founders.length > 0) {
              utils.writeLog(`🔄 Processing ${item.founders.length} founders for startup ${item.id_legacy}`, 'startups');
              item.founders = await utils.processFounders(item.founders, item.id_legacy);
              utils.writeLog(`✅ Processed ${item.founders.length} founders`, 'startups');
            } else {
              utils.writeLog(`⚠️ No founders found for startup ${item.id_legacy}`, 'startups');
              item.founders = [];
            }
          }

          const debugItem = { ...item };
          if (debugItem.founders) {
            debugItem.founders = `[${debugItem.founders.length} founders]`;
          }
          if (debugItem.image) {
            debugItem.image = debugItem.image ? 'has data' : 'null';
          }
          utils.writeLog(`🚀 Sending to API: ${JSON.stringify(debugItem)}`, table.field);
          
          await utils.addInField(table.field, item);
          utils.writeLog(`✅ Successfully processed item ${item.id_legacy}`, table.field);
          
          if (i < newItems.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
        } catch (itemError) {
          utils.writeLog(`❌ Error processing item ${item.id_legacy}: ${itemError.message}`, table.field);
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