import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { AuditLog } from '../models/auditLogModel.js';// Import the audit log model

// Example login controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      // Record failed login attempt in audit log
      await new AuditLog({
        userEmail: email,
        ipAddress: req.ip, // Capture the IP address
        success: false,
        failureReason: 'User not found',
        userAgent: req.headers['user-agent'], // Capture user agent (browser/device info)
      }).save();

      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Record failed login attempt in audit log
      await new AuditLog({
        userEmail: email,
        ipAddress: req.ip,
        success: false,
        failureReason: 'Incorrect password',
        userAgent: req.headers['user-agent'],
      }).save();

      return res.status(400).json({ message: 'Incorrect password' });
    }

    // Successful login
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Record successful login attempt in audit log
    await new AuditLog({
      userEmail: email,
      ipAddress: req.ip,
      success: true,
      userAgent: req.headers['user-agent'],
    }).save();

    res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export { AuditLog };