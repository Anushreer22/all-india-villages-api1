
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');
  
  // Clear existing data
  await prisma.village.deleteMany({});
  
  const villages = [
    { 
      name: 'Manibeli',  // Changed from village_name
      subdistrict_name: 'Akkalkuwa',
      district_name: 'Nandurbar', 
      state_name: 'Maharashtra', 
      code: '525678'
    },
    { 
      name: 'Akkalkuwa',
      subdistrict_name: 'Akkalkuwa',
      district_name: 'Nandurbar', 
      state_name: 'Maharashtra', 
      code: '525679'
    },
    { 
      name: 'Dhadgaon',
      subdistrict_name: 'Dhadgaon',
      district_name: 'Nandurbar', 
      state_name: 'Maharashtra', 
      code: '525680'
    },
    { 
      name: 'Shahada',
      subdistrict_name: 'Shahada',
      district_name: 'Nandurbar', 
      state_name: 'Maharashtra', 
      code: '525681'
    },
    { 
      name: 'Taloda',
      subdistrict_name: 'Taloda',
      district_name: 'Nandurbar', 
      state_name: 'Maharashtra', 
      code: '525682'
    },
    { 
      name: 'Navapur',
      subdistrict_name: 'Navapur',
      district_name: 'Nandurbar', 
      state_name: 'Maharashtra', 
      code: '525683'
    },
    { 
      name: 'Pune',
      subdistrict_name: 'Pune City',
      district_name: 'Pune', 
      state_name: 'Maharashtra', 
      code: '525684'
    },
    { 
      name: 'Bangalore Rural',
      subdistrict_name: 'Bangalore North',
      district_name: 'Bangalore Urban', 
      state_name: 'Karnataka', 
      code: '525685'
    },
    { 
      name: 'Mysore',
      subdistrict_name: 'Mysore',
      district_name: 'Mysore', 
      state_name: 'Karnataka', 
      code: '525686'
    },
    { 
      name: 'Jaipur',
      subdistrict_name: 'Jaipur',
      district_name: 'Jaipur', 
      state_name: 'Rajasthan', 
      code: '525687'
    },
  ];

  for (const village of villages) {
    await prisma.village.create({ data: village });
  }
  
  console.log(`✅ Seeded ${villages.length} villages`);
}

main()
  .catch(e => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
