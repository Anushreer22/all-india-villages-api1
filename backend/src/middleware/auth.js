const prisma = require('../utils/prisma');

async function apiKeyAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'Missing API Key' });
  }
  
  try {
    const key = await prisma.apiKey.findUnique({
      where: { key: apiKey, active: true }
    });
    
    if (!key) {
      return res.status(401).json({ error: 'Invalid API Key' });
    }
    
    req.userId = key.userId;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

module.exports = { apiKeyAuth };