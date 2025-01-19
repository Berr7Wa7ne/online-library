import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Checkout from "./pages/CheckOut/CheckOut";
import CheckIn from "./pages/CheckIn/CheckIn";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Routes>
        <Route path="/" element={<Login />} /> {/* Default is Login */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkin" element={<CheckIn />} />
      </Routes>
    </div>
  );
}

export default App;
