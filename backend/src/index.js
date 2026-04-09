const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Public routes
app.get('/ping', (req, res) => {
  res.json({ message: 'pong', timestamp: new Date() });
});

// Test API key middleware
async function apiKeyAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({ error: 'Missing API Key' });
  }
  const key = await prisma.apiKey.findUnique({
    where: { key: apiKey, active: true }
  });
  if (!key) {
    return res.status(401).json({ error: 'Invalid API Key' });
  }
  req.userId = key.userId;
  next();
}

// Search endpoint
app.get('/api/v1/search', apiKeyAuth, async (req, res) => {
  const { q, limit = 20 } = req.query;
  
  if (!q || q.length < 2) {
    return res.status(400).json({ error: 'Query must be at least 2 characters' });
  }

  try {
    const villages = await prisma.$queryRaw`
      SELECT v.id, v.name as village_name, v.code as village_code,
             sd.name as subdistrict_name, d.name as district_name, s.name as state_name
      FROM "Village" v
      JOIN "SubDistrict" sd ON v."subDistrictId" = sd.id
      JOIN "District" d ON sd."districtId" = d.id
      JOIN "State" s ON d."stateId" = s.id
      WHERE v.name ILIKE ${'%' + q + '%'}
      LIMIT ${parseInt(limit)}
    `;
    
    res.json({ success: true, count: villages.length, data: villages });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// States endpoint
app.get('/api/v1/states', apiKeyAuth, async (req, res) => {
  try {
    const states = await prisma.state.findMany({
      select: { id: true, code: true, name: true },
      orderBy: { name: 'asc' }
    });
    res.json({ success: true, data: states });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});