import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; 

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("auth header is ",authHeader)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized. Token missing or malformed.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("The decoded i s",decoded)
    
    req.user = await User.findById(decoded.userId).select('-password'); 

    if (!req.user) {
      return res.status(404).json({ message: 'User not found in middleware' });
    }

    
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
  
};

export default authenticate;