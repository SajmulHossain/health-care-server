import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  cloudinary: {
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  },
  open_router_api_key: process.env.OPEN_ROUTER_API_KEY,
  stripe_secrete_key: process.env.STRIPE_SECRETE_KEY,
  web_hook_secret: process.env.WEB_HOOK_SECRET,
  email_sender: {
    smtp_host: process.env.SMTP_HOST,
    smtp_port: process.env.SMTP_PORT,
    smtp_pass: process.env.SMTP_PASS,
    smtp_user: process.env.SMTP_USER,
    smtp_from: process.env.SMTP_FROM,
  },
};
