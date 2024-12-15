import React, { Component } from "react";
import { Link } from "react-router-dom";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      packages: [],
      searchQuery: "",
      filteredPackages: [],
    };
  }

  // Fetch the packages from API when the component mounts
  componentDidMount() {
    const API_URL = process.env.REACT_APP_API_URL;

    fetch(`${API_URL}/package/getpackage`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ packages: data, filteredPackages: data });
      })
      .catch((error) => console.error("Error fetching packages:", error));
  }

  // Handle search input change
  handleSearchChange = (event) => {
    const { value } = event.target;
    this.setState({ searchQuery: value }, this.filterPackages);
  };

  // Filter packages based on the search query
  filterPackages = () => {
    const { packages, searchQuery } = this.state;
    const filteredPackages = packages.filter((pkg) =>
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    this.setState({ filteredPackages });
  };

  render() {
    const { filteredPackages, searchQuery } = this.state;

    return (
      <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-4 right-4">
          <Link
            to="/admin"
            className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Go to Admin Page
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Explore Our Tour Packages</h1>

        {/* Search Box */}
        <div className="flex justify-center mb-12">
          <input
            type="text"
            placeholder="Search packages"
            value={searchQuery}
            onChange={this.handleSearchChange}
            className="px-6 py-3 border border-gray-300 rounded-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Package Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredPackages.length === 0 ? (
            <p className="text-center text-gray-600 col-span-full">No packages found.</p>
          ) : (
            filteredPackages.map((tourPackage) => (
              <div
                key={tourPackage._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out"
              >
                <img
                  src={tourPackage.image}
                  alt={tourPackage.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800">{tourPackage.title}</h2>
                  <p className="text-gray-600 mt-3">{tourPackage.description}</p>
                  <p className="mt-3 text-lg font-bold text-blue-600">${tourPackage.price}</p>

                  {/* Package Details Button */}
                  <Link to={`/package/${tourPackage._id}`}>
                    <button className="mt-6 w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
                      View Package Details
                    </button>
                  </Link>

                
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
}

export default HomePage;
