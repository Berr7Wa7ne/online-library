const mockPrisma = {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(), // Mock findUnique for the login functionality
      create: jest.fn(), // Mock create for the register functionality
    },
    book: {
        findMany: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
    },
    checkout: {
        findFirst: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
    }

  };
  
  const PrismaClient = jest.fn(() => mockPrisma);
  
  module.exports = { PrismaClient, mockPrisma };
  