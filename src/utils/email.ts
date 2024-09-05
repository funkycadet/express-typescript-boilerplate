import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import {
  EMAIL_USER,
  EMAIL_ADDRESS,
  EMAIL_PASSWORD,
  EMAIL_HOST,
  EMAIL_PORT,
} from "../config";

export const sendEmail = async (
  email: string,
  templateName: string,
  subject: string,
  placeholders: Record<string, string>,
  category?: string
) => {
  const templatePath = path.join(
    __dirname,
    "../templates",
    `${templateName}.html`
  );
  let html = fs.readFileSync(templatePath, "utf-8");

  // Replace placeholders in the template
  for (const [key, value] of Object.entries(placeholders)) {
    let regex = new RegExp(key, "g");
    html = html.replace(regex, value);
  }

  let transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
    // authMethod: "PLAIN",
    // starttls: true,
  });

  const info = await transporter.sendMail({
    from: `Pharmanager <${EMAIL_ADDRESS}>`,
    to: email,
    subject: subject,
    html: html,
    // headers: { "X-MT-Category": category || "" },
  });

  return info;
};

