const express = require('express');
const prisma = require('../utils/prisma');
const router = express.Router();

// GET /api/v1/search?q=man&limit=20
router.get('/', async (req, res) => {
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

module.exports = router;