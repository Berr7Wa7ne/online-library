const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "your_default_secret_key"; // Replace with a secure key in production

async function main() {
  const defaultLibrarian = await prisma.user.upsert({
    where: { email: 'admin@library.com' },
    update: {
      role: 'SUPERADMIN', // Update the role if the user exists
    },
    create: {
      email: 'admin@library.com',
      password: await bcrypt.hash('password123', 10), // Hash the password
      role: 'SUPERADMIN',
    },
  });

  console.log('Default librarian created:', defaultLibrarian);

  // Generate a JWT token for the default super admin
  const token = jwt.sign(
    { userId: defaultLibrarian.id, role: defaultLibrarian.role },
    JWT_SECRET_KEY,
    { expiresIn: '1d' } // Set expiration time as needed
  );

  console.log('Super Admin Token:', token);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
