import express from "express";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/send-otp", async (req, res) => {
    const { email, otp, action } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    // Check if SMTP config is present
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("--- [DEMO MODE ACTIVE] ---");
      console.warn(`Action: ${action}`);
      console.warn(`Target Email: ${email}`);
      console.warn(`Verification Code: ${otp}`);
      console.warn("--------------------------");
      
      return res.json({ 
        success: true, 
        demoMode: true,
        message: "Demo Mode: OTP logged to server console. To send real emails, configure SMTP in environment variables." 
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: email,
      subject: `Security Alert: ${action} Approval Required`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 24px;">
          <h2 style="color: #4f46e5; font-weight: 900; margin-bottom: 20px;">PakEducate Security Protocol</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            A critical administrative action has been requested: <strong>${action}</strong>.
          </p>
          <div style="background-color: #f8fafc; padding: 24px; border-radius: 16px; text-align: center; margin: 30px 0;">
            <p style="color: #94a3b8; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;">Verification Code</p>
            <h1 style="color: #1e293b; font-size: 48px; font-weight: 900; margin: 0; letter-spacing: 0.2em;">${otp}</h1>
          </div>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            Please enter this code in the application to authorize the changes. This code is valid for a single session and should not be shared.
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            &copy; ${new Date().getFullYear()} PakEducate Pro Enterprise. Secure Institutional OS.
          </p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email. Check server logs." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
