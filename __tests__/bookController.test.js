const { addBook, updateBook, searchBooks} = require('../../online-library/src/controllers/bookController');
const { mockPrisma } = require('@prisma/client');

describe('Book Controller - addBook', () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        body: {
          title: 'Test Book',
          isbn: '123-4567890123',
          coverPage: 'http://example.com/cover.jpg',
          revisionNumber: 1,
          publishedDate: '2023-01-01',
          publisher: 'Test Publisher',
          authors: ['Author One', 'Author Two'],
          genre: 'Fiction',
        },
      };
      res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      jest.clearAllMocks();
    });
  
    test('should add a new book successfully', async () => {
      // Mock the prisma.book.create method
      mockPrisma.book.create.mockResolvedValue({
        id: 1,
        title: 'Test Book',
        isbn: '123-4567890123',
        coverPage: 'http://example.com/cover.jpg',
        revisionNumber: 1,
        publishedDate: new Date('2023-01-01'),
        publisher: 'Test Publisher',
        authors: ['Author One', 'Author Two'],
        genre: 'Fiction',
      });
  
      await addBook(req, res);
  
      expect(mockPrisma.book.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Book',
          isbn: '123-4567890123',
          coverPage: 'http://example.com/cover.jpg',
          revisionNumber: 1,
          publishedDate: new Date('2023-01-01'),
          publisher: 'Test Publisher',
          authors: ['Author One', 'Author Two'],
          genre: 'Fiction',
        },
      });
  
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Book added successfully',
        book: {
          id: 1,
          title: 'Test Book',
          isbn: '123-4567890123',
          coverPage: 'http://example.com/cover.jpg',
          revisionNumber: 1,
          publishedDate: new Date('2023-01-01'),
          publisher: 'Test Publisher',
          authors: ['Author One', 'Author Two'],
          genre: 'Fiction',
        },
      });
    });
  
    test('should handle errors during book addition', async () => {
      // Mock prisma.book.create to throw an error
      mockPrisma.book.create.mockRejectedValue(new Error('Database error'));
  
      await addBook(req, res);
  
      expect(mockPrisma.book.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to add book' });
    });
  });

  