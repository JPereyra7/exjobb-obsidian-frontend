import { useEffect, useState } from "react";
import { SidebarComponent } from "../components/Sidebar";
import "../styles/dashboard.css";
import { getListings } from "../services/listingsService";
import Navbar from "../components/Navbar";

export interface iListings {
  id: string;
  propertytitle: string;
  propertydescription: string;
  propertyprice: number;
  mainimage: string;
  additionalimages: string[];
}

export const Dashboard = () => {
  const [listings, setListings] = useState<iListings[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };
    fetchListings();
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#222e40]">

<Navbar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex relative">
        {/* Sidebar with overlay */}
        <div
          className={`fixed lg:relative z-30 h-[calc(100vh-3.5rem)] transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarComponent isExpanded={isSidebarOpen} />
        </div>

        {/* Overlay for mobile only */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-x-auto">
          <div className="overflow-scroll h-[calc(100vh-7rem)] rounded-[5px] border border-gray-700">
            <h1 className="text-lg font-semibold text-white bg-[#0f172a] px-6 py-6 border-b border-gray-800">
              Active Properties
            </h1>
            <table className="min-w-full bg-[#0f172a]">
              <thead className="border-b-2 border-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28"></th>
                  <th className="px-6 py-3 text-left text-xs text-white font-semibold tracking-wider hidden lg:table-cell">
                    Listing Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-white font-semibold tracking-wider hidden md:table-cell">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-white font-semibold tracking-wider hidden lg:table-cell">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {listings.map((listing) => (
                  <tr key={listing.id}>
                    <td className="px-6 py-2 whitespace-nowrap w-20">
                      <img
                        src={listing.mainimage}
                        alt={listing.propertytitle}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-normal">
                      <div className="text-s text-gray-100 font-bold">
                        <span className="md:text-m text-gray-100 font-bold">
                          {listing.propertytitle}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <span className="text-m text-gray-100 font-semibold">
                        ${listing.propertyprice.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <button className="bg-slate-900 text-white px-3 py-1 rounded mr-2 hover:bg-teal-600">
                        Edit
                      </button>
                      <button className="bg-amber-500 text-white px-3 py-1 rounded hover:bg-red-600">
                        Delist
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};