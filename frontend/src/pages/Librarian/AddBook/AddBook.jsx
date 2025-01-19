import React, { useState } from 'react';
import axios from 'axios';

const AddBook = () => {
  // State variables for form inputs
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

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
  
    const newBook = {
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
      const token = localStorage.getItem('token'); // Get token from local storage
      if (!token) {
        console.error("No token found, user is not authenticated.");
        return; // Stop execution if no token
      }
      console.log("This is the token", token); 
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in headers
          'Content-Type': 'application/json', // Set content type
        },
      };
  
      const response = await axios.post('http://localhost:5000/book/addBook', newBook, config);
      setMessage(response.data.message);
      
      // Clear form fields on successful submission
      setTitle('');
      setIsbn('');
      setCoverPage('');
      setRevisionNumber('');
      setPublishedDate('');
      setPublisher('');
      setAuthors('');
      setGenre('');
    } catch (err) {
      setError('Failed to add book. Please try again.');
      console.error('AddBook Error:', err.message);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add a New Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">ISBN</label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cover Page URL</label>
            <input
              type="text"
              value={coverPage}
              onChange={(e) => setCoverPage(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Revision Number</label>
            <input
              type="number"
              value={revisionNumber}
              onChange={(e) => setRevisionNumber(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Published Date</label>
            <input
              type="date"
              value={publishedDate}
              onChange={(e) => setPublishedDate(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Publisher</label>
            <input
              type="text"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Authors</label>
            <input
              type="text"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Genre</label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Book
            </button>
          </div>
          {message && <p className="text-green-500">{message}</p>}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default AddBook;
