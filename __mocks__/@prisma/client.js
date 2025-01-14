const mockPrisma = {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(), // Mock findUnique for the login functionality
      create: jest.fn(), // Mock create for the register functionality
    },
  };
  
  const PrismaClient = jest.fn(() => mockPrisma);
  
  module.exports = { PrismaClient, mockPrisma };
  