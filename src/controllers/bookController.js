const prisma = require("../models/prisma.js");

// Add a book (Librarian-only)
export const addBook = async (req, res) => {
  try {
    const { title, isbn, coverPage, revisionNumber, publishedDate, publisher, authors, genre } = req.body;

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

    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ error: "Failed to add book" });
  }
};

// Update book details (Librarian-only)
export const updateBook = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, isbn, coverPage, revisionNumber, publishedDate, publisher, authors, genre } = req.body;
  
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
  
      res.status(200).json({ message: "Book updated successfully", book: updatedBook });
    } catch (error) {
      console.error("Error updating book:", error);
      res.status(500).json({ error: "Failed to update book" });
    }
  };
  
