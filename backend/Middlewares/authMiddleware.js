import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header (Bearer token) or cookies
    let token = null;
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7); // Remove "Bearer " prefix
    } else {
      token = req.cookies?.token;
    }
    
    console.log('Auth middleware check:', { 
      hasAuthHeader: !!authHeader, 
      hasCookie: !!req.cookies?.token,
      token: token ? 'present' : 'missing',
      path: req.path,
      method: req.method
    });
    
    if (!token) {
      console.error('Auth failed: No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    console.log('Token verified:', { userId: decoded.userId, role: decoded.role });
    
    // Attach user info to request
    req.user = decoded;
    
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token', reason: err.message });
  }
};
