
import { Resend } from 'resend';
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