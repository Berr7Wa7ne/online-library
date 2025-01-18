const { PrismaClient } = require('@prisma/client'); // Prisma ORM for database operations
const bcrypt = require('bcryptjs'); // Library for hashing passwords
const jwt = require('jsonwebtoken'); // Library for creating JSON Web Tokens (JWTs)

// Initialize Prisma Client
const prisma = new PrismaClient();

// Secret key for JWT signing, fetched from environment variables or a default fallback
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "your_default_secret_key"; // Replace with a secure key in production

// Main function to seed the database with a default librarian
async function main() {
  // Ensure a default super admin user exists in the database
  const defaultLibrarian = await prisma.user.upsert({
    where: { email: 'admin@library.com' }, // Check if the user exists based on email
    update: {
      role: 'SUPERADMIN', // Update the role to SUPERADMIN if the user already exists
    },
    create: {
      email: 'admin@library.com', // Default super admin email
      password: await bcrypt.hash('password123', 10), // Hash the default password for security
      role: 'SUPERADMIN', // Assign the SUPERADMIN role
    },
  });

  // Log the created or updated user details
  console.log('Default librarian created:', defaultLibrarian);

  // Generate a JWT token for the default super admin
  const token = jwt.sign(
    { userId: defaultLibrarian.id, role: defaultLibrarian.role }, // Payload: user ID and role
    JWT_SECRET_KEY, // Secret key for signing the token
    { expiresIn: '1d' } // Token validity (1 day in this case)
  );

  // Log the generated token for use
  console.log('Super Admin Token:', token);
}

// Execute the main function
main()
  .then(() => prisma.$disconnect()) // Disconnect Prisma client after execution
  .catch((e) => {
    console.error(e); // Log any errors encountered during execution
    prisma.$disconnect(); // Ensure Prisma client is disconnected even on errors
    process.exit(1); // Exit the process with an error code
  });
