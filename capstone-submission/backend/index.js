const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// root route (fix Cannot GET /)
app.get('/', (req, res) => {
  res.json({
    message: 'All India Villages API',
    status: 'running'
  });
});

// health check
app.get('/ping', (req, res) => {
  res.json({ message: 'pong', timestamp: new Date() });
});

// API key middleware
async function apiKeyAuth(req, res, next) {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({ error: 'Missing API Key' });
    }

    const key = await prisma.apiKey.findFirst({
      where: {
        key: apiKey,
        active: true
      }
    });

    if (!key) {
      return res.status(401).json({ error: 'Invalid API Key' });
    }

    req.userId = key.userId;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Auth error' });
  }
}

// search villages
app.get('/v1/search', apiKeyAuth, async (req, res) => {
  const { q, limit = 20 } = req.query;

  if (!q || q.length < 2) {
    return res.status(400).json({
      error: 'Query must be at least 2 characters'
    });
  }

  try {
    const villages = await prisma.$queryRaw`
      SELECT 
        v.id,
        v.name as village_name,
        v.code as village_code,
        sd.name as subdistrict_name,
        d.name as district_name,
        s.name as state_name
      FROM "Village" v
      JOIN "SubDistrict" sd ON v."subDistrictId" = sd.id
      JOIN "District" d ON sd."districtId" = d.id
      JOIN "State" s ON d."stateId" = s.id
      WHERE v.name ILIKE ${'%' + q + '%'}
      LIMIT ${parseInt(limit)}
    `;

    res.json({
      success: true,
      count: villages.length,
      data: villages
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get states
app.get('/v1/states', apiKeyAuth, async (req, res) => {
  try {
    const states = await prisma.state.findMany({
      select: {
        id: true,
        code: true,
        name: true
      },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: states
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// local server only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// vercel export
module.exports = app;