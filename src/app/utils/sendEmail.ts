import nodemailer from "nodemailer";
import config from "../config";

const transporter = nodemailer.createTransport({
  host: config.email_sender.smtp_host,
  port: Number(config.email_sender.smtp_port),
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.email_sender.smtp_user,
    pass: config.email_sender.smtp_pass,
  },
});

export const sendEmail = async ({
  to,
  html,
  subject,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  const info = await transporter.sendMail({
    from: config.email_sender.smtp_from,
    to,
    subject,
    html,
  });

  console.log("Message sent:", info.messageId);
};
