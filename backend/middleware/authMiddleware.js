const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication invalid.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload.isAdmin) {
        return res.status(403).json({ message: 'Admin access required.' });
    }
    req.user = { userId: payload.userId, isAdmin: payload.isAdmin };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication invalid.' });
  }
};

module.exports = authMiddleware;
