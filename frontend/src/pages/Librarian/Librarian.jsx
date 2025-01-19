import React from 'react';
import { Outlet } from 'react-router-dom'; // This will render the sub-routes
import Sidebar from '../../components/Sidebar/Sidebar'; // Import Sidebar

const Librarian = () => {
  return (
    <div className="flex justify-between gap-72 min-h-screen">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content on the right */}
      <div className="flex-1 p-8 bg-white">
        <h1 className="text-3xl font-bold mb-6">Welcome to the Librarian Panel</h1>

        {/* Render the specific content based on the selected section */}
        <Outlet />
      </div>
    </div>
  );
};

export default Librarian;
