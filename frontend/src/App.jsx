import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Checkout from "./pages/CheckOut/CheckOut";
import CheckIn from "./pages/CheckIn/CheckIn";
import Librarian from "./pages/Librarian/Librarian";
import AddBook from "./pages/Librarian/AddBook/AddBook";
import UpdateBook from "./pages/Librarian/UpdateBook/UpdateBook";
import OverDueBooks from "./pages/Librarian/OverDueBook/OverDueBook";
import LibrarianDashboard from "./pages/Librarian/LibrarianDashboard/LibrarianDashboard";
import SuperAdmin from "./pages/SuperAdmin/SuperAdmin";
import ManageLibrarian from "./pages/SuperAdmin/ManageLibrarians/ManageLibrarians";
import OverDueBook from "./pages/SuperAdmin/OverDueBooks/OverDueBook";
import Profile from "./pages/Librarian/Profile/Profile";
import 'leaflet/dist/leaflet.css';


function App() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 min-h-screen flex flex-col">
      {/* Toast Container for notifications */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="dark"
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkin" element={<CheckIn />} />

        {/* Librarian Panel and Sub-routes */}
        <Route path="/librarian" element={<Librarian />}>
          <Route index element={<LibrarianDashboard />} />
          <Route path="add-book" element={<AddBook />} />
          <Route path="update-book" element={<UpdateBook />} />
          <Route path="overdue-books" element={<OverDueBooks />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* SuperAdmin Panel and Sub-routes */}
        <Route path="/superadmin" element={<SuperAdmin />}>
          <Route path="manage-librarians" element={<ManageLibrarian />} />
          <Route path="overdue-books" element={<OverDueBook />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
