import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Checkout from "./pages/CheckOut/CheckOut";
import CheckIn from "./pages/CheckIn/CheckIn";
import Librarian from "./pages/Librarian/Librarian";
import AddBook from "./pages/Librarian/AddBook/AddBook";
import UpdateBook from "./pages/Librarian/UpdateBook/UpdateBook";
import OverDueBooks from "./pages/Librarian/OverDueBook/OverDueBook";
import SuperAdmin from "./pages/SuperAdmin/SuperAdmin";
import ManageLibrarian from "./pages/SuperAdmin/ManageLibrarians/ManageLibrarians";
import OverDueBook from "./pages/SuperAdmin/OverDueBooks/OverDueBook";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />  {/* Default Login page */}
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkin" element={<CheckIn />} />

          {/* Librarian Panel and Sub-routes */}
          <Route path="/librarian" element={<Librarian />}>
            {/* Sub-routes for Add Book, Update Book, and Overdue Books */}
            <Route path="add-book" element={<AddBook />} />
            <Route path="update-book" element={<UpdateBook />} />
            <Route path="overdue-books" element={<OverDueBooks />} />
          </Route>

          {/* SuperAdmin Panel and Sub-routes */}
          <Route path="/superadmin" element={<SuperAdmin />}>
            {/* Sub-routes for Add Book, Update Book, and Overdue Books */}
            <Route path="manage-librarians" element={<ManageLibrarian />} />
            <Route path="overdue-books" element={<OverDueBook />} />
          </Route>
        </Routes>
    </div>
  );
}

export default App;