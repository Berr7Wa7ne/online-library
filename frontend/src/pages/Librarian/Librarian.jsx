import React from 'react';
import { Outlet } from 'react-router-dom'; // Render sub-routes
import Sidebar from '../../components/Sidebar/Sidebar'; // Import Sidebar
import Footer from '../../components/Footer/Footer';

//Rendered Librarian component
const Librarian = () => {
  return (
    <div>
    <div className=" flex">
      {/* Sidebar on the left */}
      <aside className="fixed top-0 left-0 w-64 h-full bg-gray-100 dark:bg-gray-900 shadow">
        <Sidebar />
      </aside>

      {/* Main content on the right with left margin equal to sidebar width */}
      <div className="ml-64 flex-2 p-8 bg-gray-100 dark:bg-gray-900">
        <Outlet />
      </div>
    </div>
    {/* <div className='mt-7'>
    <Footer />
    </div> */}
    </div>
  );
};

export default Librarian;
