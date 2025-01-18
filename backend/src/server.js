require('dotenv').config();

const app = require('./app');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Function to initialize Superadmin
async function initializeSuperAdmin() {
  try {
    if (process.env.INIT_SUPERADMIN === 'true') {
      console.log('Initializing Superadmin...');
      await prisma.user.upsert({
        where: { email: 'admin@library.com' },
        update: {
          role: 'SUPERADMIN',
        },
        create: {
          email: 'admin@library.com',
          password: await bcrypt.hash('password123', 10),
          role: 'SUPERADMIN',
        },
      });
      console.log('Superadmin initialized successfully.');
    } else {
      console.log('Skipping Superadmin initialization (INIT_SUPERADMIN not set to true).');
    }
  } catch (error) {
    console.error('Failed to initialize superadmin:', error);
    process.exit(1); // Exit the process if superadmin initialization fails
  } finally {
    // Ensure Prisma disconnects to free resources
    await prisma.$disconnect();
  }
}

// Start the server after initializing Superadmin
initializeSuperAdmin()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error during server startup:', error);
    process.exit(1);
  });
