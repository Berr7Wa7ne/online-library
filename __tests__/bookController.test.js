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

  describe('Book Controller - updateBook', () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        params: { id: '1' }, // Simulate a book ID in params
        body: {
          title: 'Updated Book Title',
          isbn: '123-4567890987',
          coverPage: 'http://example.com/new-cover.jpg',
          revisionNumber: 2,
          publishedDate: '2023-02-01',
          publisher: 'Updated Publisher',
          authors: ['Author One', 'Author Two'],
          genre: 'Updated Genre',
        },
      };
  
      res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      jest.clearAllMocks();
    });
  
    test('should update a book successfully', async () => {
      // Mock the prisma.book.update method
      mockPrisma.book.update.mockResolvedValue({
        id: 1,
        title: 'Updated Book Title',
        isbn: '123-4567890987',
        coverPage: 'http://example.com/new-cover.jpg',
        revisionNumber: 2,
        publishedDate: new Date('2023-02-01'),
        publisher: 'Updated Publisher',
        authors: ['Author One', 'Author Two'],
        genre: 'Updated Genre',
      });
  
      await updateBook(req, res);
  
      expect(mockPrisma.book.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          title: 'Updated Book Title',
          isbn: '123-4567890987',
          coverPage: 'http://example.com/new-cover.jpg',
          revisionNumber: 2,
          publishedDate: new Date('2023-02-01'),
          publisher: 'Updated Publisher',
          authors: ['Author One', 'Author Two'],
          genre: 'Updated Genre',
        },
      });
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Book updated successfully',
        book: {
          id: 1,
          title: 'Updated Book Title',
          isbn: '123-4567890987',
          coverPage: 'http://example.com/new-cover.jpg',
          revisionNumber: 2,
          publishedDate: new Date('2023-02-01'),
          publisher: 'Updated Publisher',
          authors: ['Author One', 'Author Two'],
          genre: 'Updated Genre',
        },
      });
    });
  
    test('should handle errors during book update', async () => {
      // Mock prisma.book.update to throw a P2025 error (no record found)
      const error = new Error('Record not found');
      error.code = 'P2025';
      mockPrisma.book.update.mockRejectedValue(error);
  
      await updateBook(req, res);
  
      expect(mockPrisma.book.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          title: 'Updated Book Title',
          isbn: '123-4567890987',
          coverPage: 'http://example.com/new-cover.jpg',
          revisionNumber: 2,
          publishedDate: new Date('2023-02-01'),
          publisher: 'Updated Publisher',
          authors: ['Author One', 'Author Two'],
          genre: 'Updated Genre',
        },
      });
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update book' });
    });
  
    test('should handle generic errors during book update', async () => {
      // Mock prisma.book.update to throw a generic error
      const error = new Error('Database error');
      mockPrisma.book.update.mockRejectedValue(error);
  
      await updateBook(req, res);
  
      expect(mockPrisma.book.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          title: 'Updated Book Title',
          isbn: '123-4567890987',
          coverPage: 'http://example.com/new-cover.jpg',
          revisionNumber: 2,
          publishedDate: new Date('2023-02-01'),
          publisher: 'Updated Publisher',
          authors: ['Author One', 'Author Two'],
          genre: 'Updated Genre',
        },
      });
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update book' });
    });
  });