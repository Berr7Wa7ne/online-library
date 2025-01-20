import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "../src/App";
import './App.css';

// Store the token (remove this after initial setup)
const superAdminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJTVVBFUkFETUlOIiwiaWF0IjoxNzM3MzgyMjQ1LCJleHAiOjE3Mzk5NzQyNDV9._G6uRb1Yztcb5JLNLCud_1VEUnV0Jl_I9dgVzihcNjo';  // Replace with the actual token.
localStorage.setItem('token', superAdminToken);
console.log('Superadmin token stored.');

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
