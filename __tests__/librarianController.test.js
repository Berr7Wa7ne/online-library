const { viewOverdueBooks, triggerEmailReminders, triggerOverdueNotificationToLibrarian} = require('../../online-library/src/controllers/librarianController');
const { mockPrisma } = require('@prisma/client');
// const nodemailer = require('nodemailer');

jest.mock('nodemailer', () => {
    const mockTransporter = {
      sendMail: jest.fn(),
    };
  
    return {
      createTransport: jest.fn(() => mockTransporter),
      mockTransporter, // Exporting the mock for testing assertions
    };
  });
  
  const { mockTransporter } = require('nodemailer');

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

  describe('Librarian Controller - triggerEmailReminders', () => {
    let req, res;
  
    beforeEach(() => {
    process.env.EMAIL_USERNAME = 'test@example.com';
      req = {};
      res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      jest.clearAllMocks();
    });
  
    test('should send email reminders successfully', async () => {
        const mockOverdueBooks = [
          {
            user: { email: 'user1@example.com' },
            book: { title: 'Book 1' },
            expectedCheckinDate: new Date().toISOString(),
          },
          {
            user: { email: 'user2@example.com' },
            book: { title: 'Book 2' },
            expectedCheckinDate: new Date().toISOString(),
          },
        ];
      
        // Mock database response
        mockPrisma.checkout.findMany.mockResolvedValue(mockOverdueBooks);
      
        // Mock successful email sending
        mockTransporter.sendMail.mockResolvedValue({ messageId: 'mocked_message_id' });
      
        await triggerEmailReminders(req, res);
      
        // Assertions for nodemailer sendMail
        expect(mockTransporter.sendMail).toHaveBeenCalledTimes(mockOverdueBooks.length);
        mockOverdueBooks.forEach((book, index) => {
          expect(mockTransporter.sendMail).toHaveBeenNthCalledWith(index + 1, {
            from: process.env.EMAIL_USERNAME,
            to: book.user.email,
            subject: 'Library Check-in Reminder', // Match actual subject
            text: expect.stringContaining(`please remember to return the book "${book.book.title}"`),
          });
        });
      
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Email reminders sent successfully.',
        });
      });
  
    test('should handle errors during email reminder sending', async () => {
      mockPrisma.checkout.findMany.mockResolvedValue([
        {
          user: { email: 'user1@example.com' },
          book: { title: 'Book 1' },
        },
      ]);
  
      mockTransporter.sendMail.mockRejectedValue(new Error('Email sending failed'));
  
      await triggerEmailReminders(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to send email reminders.',
      });
    });
  });