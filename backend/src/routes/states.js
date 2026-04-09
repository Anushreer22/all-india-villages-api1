const express = require('express');
const prisma = require('../utils/prisma');
const router = express.Router();

// GET /api/v1/states
router.get('/', async (req, res) => {
  try {
    const states = await prisma.state.findMany({
      select: { id: true, code: true, name: true },
      orderBy: { name: 'asc' }
    });
    res.json({ success: true, count: states.length, data: states });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;