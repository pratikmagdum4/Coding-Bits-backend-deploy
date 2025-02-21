// routes/auditLogRoutes.js
import express from 'express';
import { getAuditLogs } from '../controllers/auditLogController.js';

const router = express.Router();

// Direct route for getting audit logs
router.get('/', getAuditLogs); // This is equivalent to '/api/audit-logs'

// Export the router
export default router;
