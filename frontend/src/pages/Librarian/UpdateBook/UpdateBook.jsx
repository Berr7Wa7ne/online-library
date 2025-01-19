import React, { useState } from 'react';
import axios from 'axios';

const UpdateBook = () => {
  const [bookId, setBookId] = useState('');  // For selecting which book to update
  const [title, setTitle] = useState('');
  const [isbn, setIsbn] = useState('');
  const [coverPage, setCoverPage] = useState('');
  const [revisionNumber, setRevisionNumber] = useState('');
  const [publishedDate, setPublishedDate] = useState('');
  const [publisher, setPublisher] = useState('');
  const [authors, setAuthors] = useState('');
  const [genre, setGenre] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const updatedBook = {
      title,
      isbn,
      coverPage,
      revisionNumber: Number(revisionNumber),
      publishedDate,
      publisher,
      authors,
      genre,
    };

    try {
      const token = localStorage.getItem('token');  // Retrieve token from localStorage
      if (!token) {
        setError("No token found, please log in.");
        return;
      }
      const response = await axios.put(
        `http://localhost:5000/book/updateBook/${bookId}`,
        updatedBook,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
      setTitle('');
      setIsbn('');
      setCoverPage('');
      setRevisionNumber('');
      setPublishedDate('');
      setPublisher('');
      setAuthors('');
      setGenre('');
      setBookId('');
    } catch (err) {
      setError('Failed to update book. Please try again.');
      console.error('UpdateBook Error:', err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Update Book</h2>
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="bookId" className="block font-medium">Book ID</label>
          <input
            id="bookId"
            type="text"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="title" className="block font-medium">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <label htmlFor="isbn" className="block font-medium">ISBN</label>
          <input
            id="isbn"
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <label htmlFor="coverPage" className="block font-medium">Cover Page URL</label>
          <input
            id="coverPage"
            type="text"
            value={coverPage}
            onChange={(e) => setCoverPage(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <label htmlFor="revisionNumber" className="block font-medium">Revision Number</label>
          <input
            id="revisionNumber"
            type="number"
            value={revisionNumber}
            onChange={(e) => setRevisionNumber(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <label htmlFor="publishedDate" className="block font-medium">Published Date</label>
          <input
            id="publishedDate"
            type="date"
            value={publishedDate}
            onChange={(e) => setPublishedDate(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <label htmlFor="publisher" className="block font-medium">Publisher</label>
          <input
            id="publisher"
            type="text"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <label htmlFor="authors" className="block font-medium">Authors</label>
          <input
            id="authors"
            type="text"
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <label htmlFor="genre" className="block font-medium">Genre</label>
          <input
            id="genre"
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div className='flex justify-center'>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Update Book
        </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBook;
