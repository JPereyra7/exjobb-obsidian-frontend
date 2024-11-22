import { useEffect, useState } from "react";
import { SidebarComponent } from "../components/Sidebar";
import axios from "axios";

export interface iListings {
  id: string;
  propertytitle: string;
  propertydescription: string;
  propertyprice: number;
  mainimage: string;
  additionalimages: string[];
}

export interface iListingsResponse {
  success: boolean;
  message: string;
  data: iListings[]; //Array in supabase (postgres)
}

export const Dashboard = () => {
  const [listings, setListings] = useState<iListings[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get<iListingsResponse>(BASE_URL);
        console.log("API Response:", response.data);
        setListings(response.data.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    getData();
  }, [BASE_URL]);

  // Calculate the total number of pages
  const totalPages = Math.ceil(listings.length / itemsPerPage);

  // Slice the listings to display only the current page's items
  const paginatedListings = listings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page nav
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <SidebarComponent />

        {/* Main Content */}
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold mb-4">Active Properties</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white shadow-lg rounded-md overflow-hidden"
              >
                <img
                  src={listing.mainimage}
                  alt={listing.propertytitle}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">
                    {listing.propertytitle}
                  </h3>
                  <p className="text-xl font-bold text-teal-600 mt-4">
                    ${listing.propertyprice.toLocaleString()}
                  </p>
                  {/* <button className="mt-4 bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">
                    View Details
                  </button> */}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 bg-gray-200 rounded ${
                currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 bg-gray-200 rounded ${
                currentPage === totalPages
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
 