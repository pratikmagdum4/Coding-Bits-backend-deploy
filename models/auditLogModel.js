import mongoose from 'mongoose';

// Define the schema for the audit logs
const auditLogSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    success: {
      type: Boolean,
      required: true,
    },
    failureReason: {
      type: String,
      required: false,
    },
    userAgent: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the model based on the schema
const AuditLog = mongoose.model('AuditLog', auditLogSchema);

// Correct export for named export
export { AuditLog };
