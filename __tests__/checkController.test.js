const { checkInBook, checkOutBook} = require('../../online-library/src/controllers/checkController');
const { mockPrisma } = require('@prisma/client');

describe('Check Controller - checkOutBook', () => {
    let req, res;
  
    beforeEach(() => {
        // Set up mock request and response objects before each test
      req = {
        body: {
          bookId: 1,
          expectedCheckinDate: '2025-01-15',
        },
        user: {
          id: 101, // Assuming the user is authenticated
        },
      };
      res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      jest.clearAllMocks();
    });
  
    test('should successfully check out a book', async () => {
      // Mock no active checkout for the book
      mockPrisma.checkout.findFirst.mockResolvedValue(null);
  
      // Mock successful book checkout creation
      mockPrisma.checkout.create.mockResolvedValue({
        id: 201,
        userId: req.user.id,
        bookId: req.body.bookId,
        expectedCheckinDate: new Date(req.body.expectedCheckinDate),
        status: 'CHECKED_OUT',
      });
  
      await checkOutBook(req, res);
  
      // Verify findFirst was called to check for active checkout
      expect(mockPrisma.checkout.findFirst).toHaveBeenCalledWith({
        where: { bookId: req.body.bookId, status: 'CHECKED_OUT' },
      });
  
      // Verify create was called to check out the book
      expect(mockPrisma.checkout.create).toHaveBeenCalledWith({
        data: {
          userId: req.user.id,
          bookId: req.body.bookId,
          expectedCheckinDate: new Date(req.body.expectedCheckinDate),
        },
      });
  
      // Verify response
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Book checked out successfully',
        checkout: {
          id: 201,
          userId: req.user.id,
          bookId: req.body.bookId,
          expectedCheckinDate: new Date(req.body.expectedCheckinDate),
          status: 'CHECKED_OUT',
        },
      });
    });
  
    test('should fail when the book is already checked out', async () => {
      // Mock an active checkout for the book
      mockPrisma.checkout.findFirst.mockResolvedValue({
        id: 202,
        userId: 102,
        bookId: req.body.bookId,
        status: 'CHECKED_OUT',
      });
  
      await checkOutBook(req, res);
  
      // Verify findFirst was called to check for active checkout
      expect(mockPrisma.checkout.findFirst).toHaveBeenCalledWith({
        where: { bookId: req.body.bookId, status: 'CHECKED_OUT' },
      });
  
      // Verify create was not called
      expect(mockPrisma.checkout.create).not.toHaveBeenCalled();
  
      // Verify response
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Book is already checked out',
      });
    });
  
    test('should handle errors gracefully', async () => {
      // Mock an error during checkout process
      mockPrisma.checkout.findFirst.mockRejectedValue(new Error('Database error'));
  
      await checkOutBook(req, res);
  
      // Verify findFirst was called
      expect(mockPrisma.checkout.findFirst).toHaveBeenCalledWith({
        where: { bookId: req.body.bookId, status: 'CHECKED_OUT' },
      });
  
      // Verify create was not called
      expect(mockPrisma.checkout.create).not.toHaveBeenCalled();
  
      // Verify response
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to check out book',
      });
    });
  });

  describe('Check Controller - checkInBook', () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        params: {
          id: 1, // Assuming checkout ID
        },
      };
      res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      jest.clearAllMocks();
    });
  
    test('should successfully check in a book', async () => {
      // Mock successful book checkout update (check-in)
      mockPrisma.checkout.update.mockResolvedValue({
        id: req.params.id,
        userId: 101,
        bookId: 1,
        checkinDate: new Date(),
        status: 'RETURNED',
      });
  
      await checkInBook(req, res);
  
      // Verify update was called to check-in the book
      expect(mockPrisma.checkout.update).toHaveBeenCalledWith({
        where: { id: parseInt(req.params.id, 10) },
        data: { checkinDate: expect.any(Date), status: 'RETURNED' },
      });
  
      // Verify response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Book checked in successfully',
        checkout: {
          id: req.params.id,
          userId: 101,
          bookId: 1,
          checkinDate: expect.any(Date),
          status: 'RETURNED',
        },
      });
    });
  
    test('should handle errors gracefully', async () => {
      // Mock an error during check-in process
      mockPrisma.checkout.update.mockRejectedValue(new Error('Database error'));
  
      await checkInBook(req, res);
  
      // Verify update was called
      expect(mockPrisma.checkout.update).toHaveBeenCalledWith({
        where: { id: parseInt(req.params.id, 10) },
        data: { checkinDate: expect.any(Date), status: 'RETURNED' },
      });
  
      // Verify response
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to check in book',
      });
    });
  });  
