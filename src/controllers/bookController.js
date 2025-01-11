const prisma = require("../models/prisma.js");

// Add a book (Librarian-only)
const addBook = async (req, res) => {
  console.log("Add Book: Received request to add a new book.");

  try {
    const { title, isbn, coverPage, revisionNumber, publishedDate, publisher, authors, genre } = req.body;
    console.log("Add Book: Request body parsed successfully.", {
      title,
      isbn,
      revisionNumber,
      publishedDate,
      publisher,
      authors,
      genre,
    });

    const newBook = await prisma.book.create({
      data: {
        title,
        isbn,
        coverPage,
        revisionNumber,
        publishedDate: new Date(publishedDate),
        publisher,
        authors,
        genre,
      },
    });

    console.log("Add Book: New book added successfully.", newBook);
    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    console.error("Add Book: Error occurred while adding a book.", error.message);
    res.status(500).json({ error: "Failed to add book" });
  }
};

// Update book details (Librarian-only)
const updateBook = async (req, res) => {
  console.log("Update Book: Received request to update book details.");

  try {
    const { id } = req.params;
    const { title, isbn, coverPage, revisionNumber, publishedDate, publisher, authors, genre } = req.body;

    console.log("Update Book: Request parameters and body parsed successfully.", {
      id,
      title,
      isbn,
      revisionNumber,
      publishedDate,
      publisher,
      authors,
      genre,
    });

    const updatedBook = await prisma.book.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        isbn,
        coverPage,
        revisionNumber,
        publishedDate: new Date(publishedDate),
        publisher,
        authors,
        genre,
      },
    });

    console.log("Update Book: Book updated successfully.", updatedBook);
    res.status(200).json({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    console.error("Update Book: Error occurred while updating the book.", error.message);

    // Log additional information for debugging if possible
    if (error.code === "P2025") {
      console.warn("Update Book: No book found with the provided ID.");
    }

    res.status(500).json({ error: "Failed to update book" });
  }
};

const searchBooks = async (req, res) => {
    try {
      console.log("SearchBooks: Received search request with query parameters:", req.query);
  
      const { title, isbn, publisher, dateAdded } = req.query;
  
      console.log("SearchBooks: Constructing search filters...");
      const filters = {
        ...(title && { title: { contains: title, mode: 'insensitive' } }),
        ...(isbn && { isbn }),
        ...(publisher && { publisher: { contains: publisher, mode: 'insensitive' } }),
        ...(dateAdded && { dateAdded: new Date(dateAdded) }),
      };
  
      console.log("SearchBooks: Filters constructed:", filters);
  
      console.log("SearchBooks: Querying database for books...");
      const books = await prisma.book.findMany({ where: filters });
  
      console.log(`SearchBooks: Found ${books.length} book(s).`);
      res.status(200).json(books);
    } catch (error) {
      console.error("SearchBooks: Error occurred while searching books:", error.message);
      res.status(500).json({ error: "Failed to search books" });
    }
  };
  
  

module.exports = { addBook, updateBook, searchBooks };
