// Import necessary modules and dependencies
const { addBook, updateBook, searchBooks } = require('../../online-library/src/controllers/bookController');
const { mockPrisma } = require('@prisma/client');

describe('Book Controller - addBook', () => {
  let req, res;

  beforeEach(() => {
    // Set up mock request and response objects before each test
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
      status: jest.fn(() => res), // Mock the status function of the response object
      json: jest.fn(),             // Mock the json function of the response object
    };

    jest.clearAllMocks(); // Clear mocks to ensure fresh state before each test
  });

  test('should add a new book successfully', async () => {
    // Mock the prisma.book.create method to resolve successfully
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

    // Call the addBook function with the mock request and response
    await addBook(req, res);

    // Verify the prisma method was called with the expected data
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

    // Verify the response was sent with the correct status and message
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

    // Call the addBook function with the mock request and response
    await addBook(req, res);

    // Verify the prisma method was called and the response was sent with an error
    expect(mockPrisma.book.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to add book' });
  });
});

describe('Book Controller - updateBook', () => {
  let req, res;

  beforeEach(() => {
    // Set up mock request and response objects before each test
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
      status: jest.fn(() => res), // Mock the status function of the response object
      json: jest.fn(),             // Mock the json function of the response object
    };

    jest.clearAllMocks(); // Clear mocks to ensure fresh state before each test
  });

  test('should update a book successfully', async () => {
    // Mock the prisma.book.update method to resolve successfully
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

    // Call the updateBook function with the mock request and response
    await updateBook(req, res);

    // Verify the prisma method was called with the expected data
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

    // Verify the response was sent with the correct status and message
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

    // Call the updateBook function with the mock request and response
    await updateBook(req, res);

    // Verify the prisma method was called and the response was sent with an error
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

    // Verify the response was sent with the correct error message
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update book' });
  });

  test('should handle generic errors during book update', async () => {
    // Mock prisma.book.update to throw a generic error
    const error = new Error('Database error');
    mockPrisma.book.update.mockRejectedValue(error);

    // Call the updateBook function with the mock request and response
    await updateBook(req, res);

    // Verify the prisma method was called and the response was sent with an error
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

    // Verify the response was sent with the correct error message
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update book' });
  });
});

describe('Book Controller - searchBooks', () => {
  let req, res;

  beforeEach(() => {
    // Set up mock request and response objects before each test
    req = {
      query: {}, // Default to no query parameters
    };
    res = {
      status: jest.fn(() => res), // Mock the status function of the response object
      json: jest.fn(),             // Mock the json function of the response object
    };

    jest.clearAllMocks(); // Clear mocks to ensure fresh state before each test
  });

  test('should return books matching the search filters', async () => {
    req.query = {
      title: 'Test Book',
      publisher: 'Test Publisher',
    };

    // Mock prisma.book.findMany to return matching books
    mockPrisma.book.findMany.mockResolvedValue([
      {
        id: 1,
        title: 'Test Book',
        isbn: '1234567890',
        publisher: 'Test Publisher',
        dateAdded: new Date('2023-01-01'),
      },
      {
        id: 2,
        title: 'Another Test Book',
        isbn: '0987654321',
        publisher: 'Test Publisher',
        dateAdded: new Date('2023-02-01'),
      },
    ]);

    // Call the searchBooks function with the mock request and response
    await searchBooks(req, res);

    // Verify the prisma method was called with the expected filters
    expect(mockPrisma.book.findMany).toHaveBeenCalledWith({
      where: {
        title: { contains: 'Test Book', mode: 'insensitive' },
        publisher: { contains: 'Test Publisher', mode: 'insensitive' },
      },
    });

    // Verify the response was sent with the correct status and books
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {
        id: 1,
        title: 'Test Book',
        isbn: '1234567890',
        publisher: 'Test Publisher',
        dateAdded: new Date('2023-01-01'),
      },
      {
        id: 2,
        title: 'Another Test Book',
        isbn: '0987654321',
        publisher: 'Test Publisher',
        dateAdded: new Date('2023-02-01'),
      },
    ]);
  });

  test('should return an empty array when no books match the filters', async () => {
    req.query = { title: 'Nonexistent Book' };

    // Mock prisma.book.findMany to return an empty array
    mockPrisma.book.findMany.mockResolvedValue([]);

    // Call the searchBooks function with the mock request and response
    await searchBooks(req, res);

    // Verify the prisma method was called with the expected filters
    expect(mockPrisma.book.findMany).toHaveBeenCalledWith({
      where: {
        title: { contains: 'Nonexistent Book', mode: 'insensitive' },
      },
    });

    // Verify the response was sent with the correct status and empty array
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  test('should handle errors during the search operation', async () => {
    req.query = { title: 'Error Book' };

    // Mock prisma.book.findMany to throw an error
    const error = new Error('Database error');
    mockPrisma.book.findMany.mockRejectedValue(error);

    // Call the searchBooks function with the mock request and response
    await searchBooks(req, res);

    // Verify the prisma method was called with the expected filters
    expect(mockPrisma.book.findMany).toHaveBeenCalledWith({
      where: {
        title: { contains: 'Error Book', mode: 'insensitive' },
      },
    });

    // Verify the response was sent with an error message
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to search books' });
  });
});
