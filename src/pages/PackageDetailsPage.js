import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Define the fetch function outside of useEffect
const fetchPackageDetails = async (id, setPackageDetails) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/package/getPackageById`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch package details');
    }

    const data = await response.json();
    setPackageDetails(data);
  } catch (error) {
    console.error('Error fetching package details:', error);
  }
};

const PackageDetailsPage = () => {
  const { id } = useParams();  // Get the package ID from the URL
  const [packageDetails, setPackageDetails] = useState(null);

  useEffect(() => {
    fetchPackageDetails(id, setPackageDetails);  // Fetch package details on mount
  }, [id]);  // Fetch when the package ID changes

  if (!packageDetails) return <div className="text-center text-lg text-gray-600">Loading...</div>;  // Show loading until data is fetched

  return (
    <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-all">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 transform transition-transform duration-500 hover:scale-105">{packageDetails.title}</h1>

      {/* Package Details Layout */}
      <div className="flex flex-col md:flex-row gap-12 items-center justify-center mb-8">
        {/* Image Section */}
        <div className="md:w-1/2 transition-transform transform hover:scale-105">
          <img
            src={packageDetails.image}
            alt={packageDetails.title}
            className="w-full h-80 object-cover rounded-lg shadow-lg transition-all duration-500 hover:opacity-80"
          />
        </div>

        {/* Details Section */}
        <div className="md:w-1/2 text-center md:text-left mt-8 md:mt-0">
          <p className="text-lg text-gray-600 mb-4 transition-all duration-500 hover:text-gray-800">{packageDetails.description}</p>
          <p className="text-3xl font-bold text-blue-600 mb-4">${packageDetails.price}</p>
          
          {/* Available Dates Section */}
          <div className="mt-4 text-sm text-gray-500">
            <span className="font-semibold text-gray-800">Available Dates:</span>
            <ul className="mt-2 space-y-2 text-blue-600">
              {packageDetails.availableDates.map((date, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="inline-block p-2 bg-blue-100 text-blue-600 rounded-md shadow-md">{date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* "Book Now" Button */}
      <div className="mt-6 flex justify-center">
        <Link to={{ pathname: `/book/${id}`, state: { packageDetails } }}>
          <button className="py-3 px-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-md shadow-lg transform transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800 hover:scale-105">
            Book Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PackageDetailsPage;
