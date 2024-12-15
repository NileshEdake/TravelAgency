import React, { useState, useEffect } from 'react';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [error, setError] = useState(null);
  
  const fetchBookings = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data);

    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.message); // Update error state
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      alert(`Booking status updated to ${status}!`);
      fetchBookings(); // Refresh booking list
    } catch (error) {
      console.error('Error updating booking:', error);
      setError(error.message);
    }
  };

  const deleteBooking = async (id) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/bookings/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete booking');
      }

      alert('Booking deleted successfully!');
      fetchBookings(); // Refresh booking list after deletion
    } catch (error) {
      console.error('Error deleting booking:', error);
      setError(error.message);
    }
  };

  const handleViewDetails = async (booking) => {
    setSelectedBooking(booking);

    if (booking.packageId) {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/admin/packages/${booking.packageId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch package details');
        }

        const packageDetails = await response.json();
        console.log('Package Details:', packageDetails);
        const packageName = packageDetails.title;
        console.log('Package Title:', packageName);

        setSelectedBooking({ ...booking, packageName }); // Set packageName here
      } catch (error) {
        console.error('Error fetching package details:', error);
      }
    }
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4">Manage Bookings</h2>
      <p className="text-center text-gray-600">Here you can view and manage bookings.</p>

      {error && <p className="text-center text-red-600 mt-4">{error}</p>}

      <div className="mt-10">
        {bookings.length === 0 ? (
          <p className="text-center text-gray-500">No bookings available.</p>
        ) : (
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li key={booking._id} className="p-4 border rounded-md shadow-sm">
                <h3 className="text-lg font-bold">Booking by: {booking.name}</h3>
                <p>Email: {booking.email}</p>
                <p>Package: {booking.packageId ? booking.packageId.title : 'N/A'}</p>
                <p>Number of Travelers: {booking.numberOfTravelers}</p>
                <p>Special Requests: {booking.specialRequests || 'N/A'}</p>
                <p>Status: {booking.status || 'Pending'}</p>

                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleViewDetails(booking)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => updateBookingStatus(booking._id, 'Confirmed')}
                    className="text-green-600 hover:text-green-800"
                  >
                    Confirm
                  </button>

                  <button
                    onClick={() => updateBookingStatus(booking._id, 'Cancelled')}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => deleteBooking(booking._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Booking Details</h2>
            <p>
              <strong>Name:</strong> {selectedBooking.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedBooking.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedBooking.phoneNumber}
            </p>
            <p>
              <strong>Package Name:</strong>{' '}
              {selectedBooking.packageName || 'Fetching...'}
            </p>
            <p>
              <strong>Number of Travelers:</strong> {selectedBooking.numberOfTravelers}
            </p>
            <p>
              <strong>Special Requests:</strong>{' '}
              {selectedBooking.specialRequests || 'None'}
            </p>
            <p>
              <strong>Status:</strong> {selectedBooking.status || 'Pending'}
            </p>

            <button
              onClick={closeModal}
              className="mt-4 py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
