import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('token', data.token); // Store token
        sessionStorage.setItem('role', 'admin'); // Store role
        navigate('/admin/dashboard'); // Redirect to dashboard
      } else {
        alert(data.message); // Show error message
      }
    } catch (error) {
      console.error('Error during admin login:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Login</h1>
      <form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto">
        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <button type="submit" className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
