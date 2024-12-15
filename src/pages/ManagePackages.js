import React, { useState, useEffect } from 'react';

const ManagePackages = () => {
  const [packages, setPackages] = useState([]); // State to store packages
  const [error, setError] = useState(null);    // State to store any errors
  const [formData, setFormData] = useState({   // State for the add package form
    title: '',
    description: '',
    price: '',
    availableDates: '',
    image: '',
  });
  const [showForm, setShowForm] = useState(false); // State to toggle the form
  const [isEditing, setIsEditing] = useState(false); // State to check if we're editing a package
  const [currentPackageId, setCurrentPackageId] = useState(null); // Store the current package ID to edit

  // Fetch packages from the backend
  const fetchPackages = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/packages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch packages');
      }

      const data = await response.json();
      setPackages(data); // Update state with fetched data
    } catch (error) {
      console.error('Error fetching packages:', error);
      setError(error.message); // Update error state
    }
  };

  // Add or Edit a package
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      const endpoint = isEditing
        ? `${process.env.REACT_APP_API_URL}/admin/packages/${currentPackageId}` // Edit endpoint
        : `${process.env.REACT_APP_API_URL}/admin/packages`; // Add new package endpoint

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          availableDates: formData.availableDates.split(',').map(date => date.trim()), // Convert dates to array
        }),
      });

      if (!response.ok) {
        throw new Error(isEditing ? 'Failed to update package' : 'Failed to add package');
      }

      const data = await response.json();
      alert(isEditing ? 'Package updated successfully!' : 'Package added successfully!');
      setFormData({ title: '', description: '', price: '', availableDates: '', image: '' }); // Clear form
      setShowForm(false); // Hide the form
      setIsEditing(false); // Reset editing state
      setCurrentPackageId(null); // Clear current package ID
      fetchPackages(); // Refresh package list
    } catch (error) {
      console.error('Error saving package:', error);
      setError(error.message);
    }
  };

  // Handle edit click to pre-fill form data
  const handleEditClick = (pkg) => {
    setFormData({
      title: pkg.title,
      description: pkg.description,
      price: pkg.price,
      availableDates: pkg.availableDates.join(', '), // Join array for input
      image: pkg.image,
    });
    setCurrentPackageId(pkg._id);
    setIsEditing(true);
    setShowForm(true);
  };

  // Handle delete package
  const handleDeleteClick = async (id) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/packages/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete package');
      }

      alert('Package deleted successfully!');
      fetchPackages(); // Refresh package list
    } catch (error) {
      console.error('Error deleting package:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchPackages(); // Fetch packages when the component loads
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4">Manage Packages</h2>
      <p className="text-center text-gray-600">Here you can add, edit, and delete packages.</p>

      {error && (
        <p className="text-center text-red-600 mt-4">{error}</p>
      )}

      {/* Add Package Button */}
      <div className="text-center mt-6">
        <button
          onClick={() => setShowForm(true)}
          className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Package
        </button>
      </div>

      {/* Add or Edit Package Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{isEditing ? 'Edit Package' : 'Add New Package'}</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Package Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <textarea
                name="description"
                placeholder="Package Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="availableDates"
                placeholder="Available Dates (comma-separated)"
                value={formData.availableDates}
                onChange={(e) => setFormData({ ...formData, availableDates: e.target.value })}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <div className="flex justify-between">
                <button type="submit" className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600">
                  {isEditing ? 'Save Changes' : 'Save Package'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Display Existing Packages */}
      <div className="mt-10">
        <h3 className="text-xl font-bold mb-4">Existing Packages</h3>
        {packages.length === 0 ? (
          <p className="text-center text-gray-500">No packages available.</p>
        ) : (
          <ul className="space-y-4">
            {packages.map((pkg) => (
              <li key={pkg._id} className="p-4 border rounded-md shadow-sm">
                <h3 className="text-lg font-bold">{pkg.title}</h3>
                <p>{pkg.description}</p>
                <p className="font-semibold text-blue-600">Price: ${pkg.price}</p>
                <div className="flex justify-between mt-4">
                  {/* Edit Button */}
                  <button
                    onClick={() => handleEditClick(pkg)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    Edit
                  </button>
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteClick(pkg._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManagePackages;
