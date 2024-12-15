import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const InvoicePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { invoice } = location.state || {}; // Retrieve the invoice data passed from the booking page

  if (!invoice) {
    return <div className="text-center mt-8 text-red-500">No invoice data available</div>;
  }

  const handleOkClick = () => {
    navigate('/'); // Redirects to home page or any page you want
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10 px-4">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-8">
        {/* Invoice Header */}
        <div className="border-b pb-4 mb-6 text-center">
          <h1 className="text-4xl font-bold text-blue-600">Booking Details</h1>
          <p className="text-gray-600 mt-2">Thank you for your booking!</p>
        </div>

        {/* Customer Details */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Customer Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <p>
              <span className="font-semibold">Name:</span> {invoice.customer.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {invoice.customer.email}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {invoice.customer.phoneNumber}
            </p>
          </div>
        </div>

        {/* Package Details */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Package Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <p>
              <span className="font-semibold">Package Name:</span> {invoice.package.title}
            </p>
            <p>
              <span className="font-semibold">Price per Person:</span> ${invoice.package.price}
            </p>
            <p>
              <span className="font-semibold">Number of Travelers:</span> {invoice.package.travelers}
            </p>
          </div>
        </div>

        {/* Total Price */}
        <div className="border-t pt-4 text-right">
          <h2 className="text-xl font-bold text-gray-900">
            Total: <span className="text-blue-600">${invoice.totalPrice}</span>
          </h2>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">If you have any questions, contact us at support@travelagency.com.</p>
        </div>

        {/* OK Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleOkClick}
            className="py-2 px-6 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
