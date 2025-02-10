import React from 'react';
import { Link } from 'react-router-dom';  // Import Link for navigation

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-gray-800 text-white p-5">
      <h2 className="text-2xl font-bold mb-8 text-center">Librarian Panel</h2>
      
      <ul className="space-y-6">
        {/* Library Dashboard (Overview) */}
        <li>
          <Link to="/librarian" className="flex items-center space-x-3 text-lg hover:text-orange-500">
            <span>📚</span>
            <span>Library Dashboard</span>
          </Link>
        </li>

        {/* Add Books Section */}
        <li>
          <Link to="/librarian/add-book" className="flex items-center space-x-3 text-lg hover:text-orange-500">
            <span>➕</span>
            <span>Add Books</span>
          </Link>
        </li>

        {/* Update Books Section */}
        <li>
          <Link to="/librarian/update-book" className="flex items-center space-x-3 text-lg hover:text-orange-500">
            <span>✏️</span>
            <span>Update Books</span>
          </Link>
        </li>

        {/* Overdue Books Section */}
        <li>
          <Link to="/librarian/overdue-books" className="flex items-center space-x-3 text-lg hover:text-orange-500">
            <span>⚠️</span>
            <span>Overdue Books</span>
          </Link>
        </li>

          {/* Profile Section */}
          <li>
          <Link to="/librarian/profile" className="flex items-center space-x-3 text-lg hover:text-orange-500">
            <span>👤</span>
            <span>Profile</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
