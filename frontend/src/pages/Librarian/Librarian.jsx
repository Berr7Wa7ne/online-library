import React from 'react';
import { Outlet } from 'react-router-dom'; // Render sub-routes
import Sidebar from '../../components/Sidebar/Sidebar'; // Import Sidebar

//Rendered Librarian component
const Librarian = () => {
  return (
    <div className=" flex">
      {/* Sidebar on the left */}
      <aside className="fixed top-0 left-0 w-64 h-full bg-gray-100 shadow">
        <Sidebar />
      </aside>

      {/* Main content on the right with left margin equal to sidebar width */}
      <div className="ml-64 flex-2 p-8 bg-white">
        <Outlet />
      </div>
    </div>
  );
};

export default Librarian;
