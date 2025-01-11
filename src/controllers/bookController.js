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

