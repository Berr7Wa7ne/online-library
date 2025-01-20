import React, { useState } from 'react';
import axios from 'axios';

const ManageLibrarian = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('profilePhoto', profilePhoto);

    try {
        const token = localStorage.getItem('token');  // Retrieve the token from localStorage.
        const response = await axios.post('http://localhost:5000/auth/create-librarian', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,  // Attach the token in the Authorization header.
            'Content-Type': 'multipart/form-data',
          },
        });
        setMessage(response.data.message);
        setEmail('');
        setPassword('');
        setProfilePhoto(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to create librarian.');
      }      
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Librarian</h2>
      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="profilePhoto">
            Profile Photo
          </label>
          <input
            type="file"
            id="profilePhoto"
            onChange={handleFileChange}
            className="w-full p-2"
            accept="image/*"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Create Librarian
        </button>
      </form>
    </div>
  );
};

export default ManageLibrarian;
