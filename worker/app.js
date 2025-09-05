import 'dotenv/config'; 
import { Resend } from 'resend';
import utils from './src/utils.js';

const resend = new Resend(process.env.RESEND_KEY);

export async function sendTempPassEmail(name, email, temp_password) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: `${name}, we are waiting for you !`,
      html: `
        <div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; color: #333; padding: 20px 14px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: auto; background-color: #fff;">
            <div style="text-align: center; background-color: #333; padding: 14px;">
              <a style="text-decoration: none; outline: none;" href="[Website Link]" target="_blank" rel="noopener">
                <img style="height: 90px; vertical-align: middle;" src="https://www.jeb-incubator.com/images/logo.png" alt="logo" height="90">
              </a>
            </div>
            <div style="padding: 14px;">
              <h1 style="font-size: 22px; margin-bottom: 26px;">Your password needs to be changed</h1>
              <p>Our website has had a makeover! A new site means a new password. Your temporary password is:</p>
              <p><strong>${temp_password}</strong></p>
              <p>You can access our website at this address:</p>
              <p>Best regards,<br>JEB Team</p>
            </div>
          </div>
          <div style="max-width: 600px; margin: auto;">
            <p style="color: #999;">The email was sent to ${email}<br>You received this email because you are registered with [Company Name]</p>
          </div>
        </div>
      `
    });

    if (error) {
      utils.writeLog(`❌ Error sending email to ${email}: ${error.message}`, "email");
      return;
    }

    utils.writeLog(`✅ Email sent to ${email}, ID: ${data.id}`, "email");
    
  } catch (error) {
    utils.writeLog(`❌ Exception for ${email}: ${error.message}`, "email");
  }
}

// sendTempPassEmail("Antton", "antton.ducos@gmail.com", "NEW_PASSWORD")

import fs from "fs";

const api_url = 'http://localhost:8000/';
const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

async function workitout() {
  try {
    for (const { field } of config) {
      utils.writeLog(`🔄 Processing field: ${field}`, "config");

      const data = await utils.getByField(field);

      const transformedData = data.map(({ id, ...rest }) => ({
        ...rest,
        id_legacy: id
      }));

      const localResponse = await fetch(api_url + field);
      const localData = await localResponse.json();

      const existingLegacyIds = new Set(localData.map(p => p.id_legacy));

      const newItems = [];
      const skippedItems = [];

      for (const p of transformedData) {
        if (existingLegacyIds.has(p.id_legacy)) {
          skippedItems.push(p);
        } else {
          newItems.push(p);
        }
      }

      skippedItems.forEach(p => {
        utils.writeLog(
          `ℹ️ ${field} already existing (id_legacy=${p.id_legacy}, name=${p.name || "N/A"})`,
          field
        );
      });

      for (const item of newItems) {
        utils.addInField(field, item);
      }
    }
  } catch (error) {
    utils.writeLog("❌ Error :" + error, "ancientDataBase");
  }
}


// Exemple d'utilisation
workitout()
