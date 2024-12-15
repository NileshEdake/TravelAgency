import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PackageDetailsPage from "./pages/PackageDetailsPage";
import BookingFormPage from "./pages/BookingFormPage";
import InvoicePage from "./pages/InvoicePage";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ManagePackages from "./pages/ManagePackages";
import ManageBookings from "./pages/ManageBookings";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/package/:id" element={<PackageDetailsPage />} />
        <Route path="/book/:id" element={<BookingFormPage />} />
        <Route path="/invoice" element={<InvoicePage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Wrap protected routes with PrivateRoute */}
  
          <Route path="/admin/dashboard" element={<AdminDashboard />}>
            <Route path="packages" element={<ManagePackages />} />
            <Route path="bookings" element={<ManageBookings />} />
          </Route>
       
      </Routes>
    </Router>
  );
}

export default App;
