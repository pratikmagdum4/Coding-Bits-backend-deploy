import { AuditLog } from '../models/auditLogModel.js'; // Correct import

export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(10);
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching logs' ,error});
  }
};