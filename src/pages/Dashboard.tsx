import { useEffect, useState } from "react";
import { SidebarComponent } from "../components/Sidebar";
import '../styles/dashboard.css'
import { getListings } from "../services/listingsService";

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

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings();
        setListings(data);
      } catch (error) {
        // Handle errors appropriately in your UI
        console.error("Error fetching listings:", error);
      }
    };
    fetchListings();
  }, []);

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

        {/* Banner for Active Properties */}
        <div className="flex flex-col">
          <div className="flex items-center p-4 w-full h-16 z-10">
            <h1 className="text-2xl font-bold mb-2 text-slate-700">Active Properties</h1>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-md overflow-hidden listingsContainer"
                >
                  <img
                    src={listing.mainimage}
                    alt={listing.propertytitle}
                    className="w-full h-48 object-cover propertyImage"
                    />
                  <div className="p-2">
                    <h3 className="text-lg font-semibold">
                      {listing.propertytitle}
                    </h3>

                    {/* Price + Button container */}
                    <div className="flex items-center justify-between mt-4">
                    <p className="text-xl font-bold text-teal-600 mt-2">
                      ${listing.propertyprice.toLocaleString()}
                    </p>
                    <button className="mt-2 bg-teal-500 text-white px-2 py-1 rounded hover:bg-teal-600">
                    Edit Listing
                    </button>
                    </div>
                    </div>

              </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 space-x-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 bg-slate-900 text-white rounded ${
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
                className={`px-4 py-2 bg-slate-900 text-white rounded ${
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
      </div>
    </>
  );
};
