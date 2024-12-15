import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BookingFormPage = () => {
  const { id } = useParams(); // Get packageId from the URL
  const API_URL = process.env.REACT_APP_API_URL; // Use API URL from environment variables
  const navigate = useNavigate(); // For navigating to the InvoicePage

  const [packageDetails, setPackageDetails] = useState(null); // To store fetched package details
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    numberOfTravelers: 1,
    specialRequests: '',
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [showPopup, setShowPopup] = useState(false); // State to control the popup visibility

  // Fetch package details by ID
  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/package/getPackageById`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }), // Send the packageId to the backend
        });
        const data = await response.json();
        setPackageDetails(data); // Store package details in state
        setTotalPrice(data.price); // Initialize total price with the package price
      } catch (error) {
        console.error('Error fetching package details:', error);
      }
    };

    fetchPackageDetails();
  }, [id, API_URL]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === 'numberOfTravelers' && packageDetails) {
      // Update total price based on the number of travelers
      setTotalPrice(packageDetails.price * value);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phoneNumber, numberOfTravelers, specialRequests } = formData;

    const bookingData = {
      packageId: id,
      name,
      email,
      phoneNumber,
      numberOfTravelers,
      specialRequests,
      totalPrice,
    };

    try {
      // Send booking data to the backend
      const response = await fetch(`${API_URL}/bookings/addbookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();
      alert('Booking successful');
      generateInvoice(bookingData); // Generate the invoice after successful booking
    } catch (error) {
      console.error('Error making booking:', error);
    }
  };

  // Generate invoice with customer and package details
  const generateInvoice = (bookingData) => {
    const invoiceDetails = {
      customer: {
        name: bookingData.name,
        email: bookingData.email,
        phoneNumber: bookingData.phoneNumber,
      },
      package: {
        id,
        title: packageDetails?.title, // Include the package name here
        price: packageDetails?.price,
        travelers: bookingData.numberOfTravelers,
      },
      totalPrice,
    };

    setShowPopup(true); // Show popup after booking
    // Navigate to the InvoicePage after clicking "View Invoice"
    setTimeout(() => navigate('/invoice', { state: { invoice: invoiceDetails } }), 3000);
  };

  return (
    <div className="container mx-auto px-6 py-12 bg-gradient-to-r from-indigo-100 to-pink-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">{packageDetails?.title || 'Loading...'}</h1>
      <p className="text-center text-xl text-gray-600 mb-8">Package Details</p>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto p-8 bg-white rounded-lg shadow-xl border border-gray-300">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-semibold">Your Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-700 font-semibold">Your Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-gray-700 font-semibold">Your Phone Number</label>
          <input
            id="phoneNumber"
            type="text"
            name="phoneNumber"
            placeholder="Enter your phone number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="numberOfTravelers" className="block text-gray-700 font-semibold">Number of Travelers</label>
          <input
            id="numberOfTravelers"
            type="number"
            name="numberOfTravelers"
            min="1"
            value={formData.numberOfTravelers}
            onChange={handleChange}
            required
            className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="specialRequests" className="block text-gray-700 font-semibold">Special Requests</label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            placeholder="Any special requests?"
            value={formData.specialRequests}
            onChange={handleChange}
            className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-gray-800">Total Price: ${totalPrice}</p>
          <button
            type="submit"
            className="py-3 px-8 bg-blue-500 text-white font-semibold rounded-md shadow-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            Submit Booking
          </button>
        </div>
      </form>

      {/* Popup after successful booking */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center animate__animated animate__fadeIn animate__delay-1s">
            <p className="text-lg font-semibold text-gray-800">Booking Successful!</p>
            <p className="mt-2 text-gray-600">Redirecting to your invoice...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingFormPage;
