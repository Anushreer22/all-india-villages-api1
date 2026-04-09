const express = require('express');
const prisma = require('../utils/prisma');
const router = express.Router();

// GET /api/v1/autocomplete?q=man&limit=10
router.get('/', async (req, res) => {
  const { q, limit = 10 } = req.query;
  
  if (!q || q.length < 2) {
    return res.status(400).json({ error: 'Query too short' });
  }

  try {
    const villages = await prisma.$queryRaw`
      SELECT v.id, v.name as label,
             CONCAT(v.name, ', ', sd.name, ', ', d.name, ', ', s.name) as "fullAddress"
      FROM "Village" v
      JOIN "SubDistrict" sd ON v."subDistrictId" = sd.id
      JOIN "District" d ON sd."districtId" = d.id
      JOIN "State" s ON d."stateId" = s.id
      WHERE v.name ILIKE ${'%' + q + '%'}
      LIMIT ${parseInt(limit)}
    `;
    
    res.json({ success: true, data: villages });
  } catch (error) {
    console.error('Autocomplete error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;