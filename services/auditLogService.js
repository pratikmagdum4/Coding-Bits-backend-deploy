import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const auditLogPath = path.join(__dirname, "../logs/audit.log");

export const logAudit = (logEntry) => {
  const logMessage = `${new Date().toISOString()} | ${logEntry}\n`;
  fs.appendFileSync(auditLogPath, logMessage, (err) => {
    if (err) {
      console.error("Error writing to audit log:", err);
    }
  });
};
