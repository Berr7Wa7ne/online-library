import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../../components/Modal/Modal";
import { useLocation } from "react-router-dom";

const Checkout = () => {
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expectedCheckinDate, setExpectedCheckinDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/book/getAllBooks");
        setBooks(response.data.books);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Failed to load books.");
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    if (location.state?.book) {
      setSelectedBook(location.state.book);
      setIsModalOpen(true);
    }
  }, [location.state]);

  useEffect(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 10);
    setExpectedCheckinDate(defaultDate.toISOString().split("T")[0]);
  }, []);

  const handleCheckout = async () => {
    if (!selectedBook) {
      setError("No book selected.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      setIsLoading(true);
      setError("");

      await axios.post("http://localhost:5000/check/checkout", {
        bookId: selectedBook.id,
        expectedCheckinDate,
      }, { headers: { Authorization: `Bearer ${token}` } });

      setIsModalOpen(false);
      alert("Book checked out successfully!");
    } catch (error) {
      console.error("Error during checkout:", error);
      setError(error.response?.data?.error || "Failed to checkout book");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold text-orange-600 text-center">My <span className="text-purple-600">Books</span></h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {books.length > 0 ? (
        books.map((book) => (
          <div key={book.id} className="bg-white p-6 w-full flex flex-col items-center space-y-4 hover:shadow-xl transform transition-all scale-105">
          {/* Book Image */}
          {book.bookPhoto && (
            <img
              src={`http://localhost:5000/${book.bookPhoto}`}
              alt={book.title}
              className="w-40 h-56 object-cover rounded-lg"
            />
          )}
        
          {/* Book Details */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold">{book.title}</h3>
            <p className="text-gray-700 text-sm">{book.authors}</p>
            <p className="text-gray-700 text-sm">{book.publisher}</p>
            <p className="text-gray-700 text-sm">{book.publishedDate?.split("T")[0]}</p>
            <p className="text-gray-700 text-sm">{book.genre}</p>
          </div>
        
          {/* Checkout Button */}
          <button 
            onClick={() => { setSelectedBook(book); setIsModalOpen(true); }}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            Borrow Book
          </button>
        </div>
    ))
  ) : (
    <p className="text-gray-500 text-lg">No books available.</p>
  )}
</div>


      {isModalOpen && selectedBook && (
        <Modal isOpen={true} onClose={() => setIsModalOpen(false)}>
          <div className="relative bg-white p-6 rounded-lg">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 text-red-700 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" className="w-6 h-6">
                <path fillRule="evenodd" d="M6.225 4.811a1 1 0 011.415 0L12 9.171l4.36-4.36a1 1 0 111.415 1.415L13.415 10.5l4.36 4.36a1 1 0 01-1.415 1.415L12 11.829l-4.36 4.36a1 1 0 01-1.415-1.415l4.36-4.36-4.36-4.36a1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
            </button>

            <div className="text-center">
            {selectedBook.bookPhoto && (
            <img
              src={`http://localhost:5000/${selectedBook.bookPhoto}`} // ✅ Ensure correct backend file path
              alt={selectedBook.title}
              className="w-20 h-26 object-cover rounded-lg mx-auto mb-4"
            />
          )}
              <h3 className="text-2xl font-bold mb-4">Checkout Book</h3>
              <p>Title: <strong>{selectedBook.title}</strong></p>
              <p>Author: {selectedBook.authors}</p>
              <p>Publisher: {selectedBook.publisher}</p>
              <p>Published Date: {selectedBook.publishedDate?.split("T")[0]}</p>
              <p>Genre: {selectedBook.genre}</p>
            </div>

            <div className="mt-4">
              <label htmlFor="checkinDate" className="block text-gray-600">Expected Check-In Date</label>
              <input
                id="checkinDate"
                type="date"
                value={expectedCheckinDate}
                onChange={(e) => setExpectedCheckinDate(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 mt-2"
              />
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            <div className="flex justify-center mt-6">
              <button onClick={handleCheckout} className="bg-blue-500 text-white px-4 py-2 rounded" disabled={isLoading || !expectedCheckinDate}>
                {isLoading ? "Processing..." : "Confirm Checkout"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Checkout;
