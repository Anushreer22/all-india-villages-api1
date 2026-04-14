const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Search villages
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters' });
    }

    const villages = await prisma.village.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { district_name: { contains: q, mode: 'insensitive' } },
          { state_name: { contains: q, mode: 'insensitive' } }
        ]
      },
      take: parseInt(limit),
      orderBy: { name: 'asc' }
    });

    res.json({ data: villages });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Autocomplete
router.get('/autocomplete', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters' });
    }

    const villages = await prisma.village.findMany({
      where: {
        name: { contains: q, mode: 'insensitive' }
      },
      select: {
        name: true,
        district_name: true,
        state_name: true,
        code: true
      },
      take: parseInt(limit),
      orderBy: { name: 'asc' },
      distinct: ['name']
    });

    const suggestions = villages.map(v => ({
      label: v.name,
      fullAddress: `${v.district_name || ''}, ${v.state_name || ''}`.trim()
    }));

    res.json({ data: suggestions });
  } catch (error) {
    console.error('Autocomplete error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all states
router.get('/states', async (req, res) => {
  try {
    const states = await prisma.village.findMany({
      select: { state_name: true },
      distinct: ['state_name'],
      orderBy: { state_name: 'asc' }
    });

    res.json({ data: states.map(s => s.state_name) });
  } catch (error) {
    console.error('States error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get village by code
router.get('/village/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    const village = await prisma.village.findUnique({
      where: { code: code }
    });

    if (!village) {
      return res.status(404).json({ error: 'Village not found' });
    }

    res.json({ data: village });
  } catch (error) {
    console.error('Get village error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
