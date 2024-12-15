import React from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  // Check for authentication token and role in localStorage
  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role'); 
  console.log(token)
  // Ensure role is 'admin'

  // If no token or incorrect role, redirect to login page
  if (!token || role !== 'admin') {
    return <Navigate to="/admin" />;  // Redirect to admin login if not authenticated or role is incorrect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
      <div className="flex justify-center space-x-4 mb-8">
        <Link to="/admin/dashboard/packages" className="py-2 px-4 bg-blue-500 text-white rounded-md">
          Manage Packages
        </Link>
        <Link to="/admin/dashboard/bookings" className="py-2 px-4 bg-green-500 text-white rounded-md">
          Manage Bookings
        </Link>
      </div>
      <Outlet /> {/* This will render the child routes like ManagePackages or ManageBookings */}
    </div>
  );
};

export default AdminDashboard;
