const { viewOverdueBooks, triggerEmailReminders, triggerOverdueNotificationToLibrarian} = require('../../online-library/src/controllers/librarianController');
const { mockPrisma } = require('@prisma/client');

describe('Librarian Controller - viewOverdueBooks', () => {
    let req, res;
  
    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      jest.clearAllMocks();
    });
  
    test('should successfully fetch overdue books', async () => {
      const mockCurrentDate = new Date('2025-01-01');
      jest.useFakeTimers().setSystemTime(mockCurrentDate); // Mock current date
  
      // Mock overdue books data
      const mockOverdueBooks = [
        {
          id: 1,
          checkoutDate: new Date('2024-12-20'),
          expectedCheckinDate: new Date('2024-12-25'),
          user: {
            id: 101,
            email: 'user1@example.com',
          },
          book: {
            id: 201,
            title: 'Book Title 1',
            isbn: '1234567890',
          },
        },
        {
          id: 2,
          checkoutDate: new Date('2024-12-22'),
          expectedCheckinDate: new Date('2024-12-28'),
          user: {
            id: 102,
            email: 'user2@example.com',
          },
          book: {
            id: 202,
            title: 'Book Title 2',
            isbn: '0987654321',
          },
        },
      ];
  
      // Mock Prisma's findMany method
      mockPrisma.checkout.findMany.mockResolvedValue(mockOverdueBooks);
  
      await viewOverdueBooks(req, res);
  
      // Calculate overdue days for each book
      const expectedResponse = mockOverdueBooks.map((book) => ({
        ...book,
        overdueDays: Math.floor(
          (mockCurrentDate - new Date(book.expectedCheckinDate)) / (1000 * 60 * 60 * 24)
        ),
      }));
  
      // Assertions
      expect(mockPrisma.checkout.findMany).toHaveBeenCalledWith({
        where: {
          status: 'CHECKED_OUT',
          expectedCheckinDate: { lt: mockCurrentDate },
        },
        select: {
          id: true,
          checkoutDate: true,
          expectedCheckinDate: true,
          user: {
            select: {
              id: true,
              email: true,
            },
          },
          book: {
            select: {
              id: true,
              title: true,
              isbn: true,
            },
          },
        },
      });
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
  
      jest.useRealTimers(); // Restore real timers after the test
    });
  
    test('should handle errors gracefully', async () => {
      // Mock an error
      mockPrisma.checkout.findMany.mockRejectedValue(new Error('Database error'));
  
      await viewOverdueBooks(req, res);
  
      // Assertions
      expect(mockPrisma.checkout.findMany).toHaveBeenCalledWith({
        where: {
          status: 'CHECKED_OUT',
          expectedCheckinDate: { lt: expect.any(Date) },
        },
        select: expect.any(Object),
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch overdue books' });
    });
  });