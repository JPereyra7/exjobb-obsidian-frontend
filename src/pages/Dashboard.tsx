import { useEffect, useState } from "react";
import { SidebarComponent } from "../components/Sidebar";
import "../styles/dashboard.css";
import { getListings } from "../services/listingsService";
import Navbar from "../components/Navbar";
import { DashboardStats } from "../components/DashboardStats";
import { DollarSign, Power, House, PowerOff } from "lucide-react";

export interface iListings {
  id: string;
  propertytitle: string;
  propertydescription: string;
  propertyprice: number;
  activelisting: boolean;
  mainimage: string;
  additionalimages: string[];
}

export const Dashboard = () => {
  const [listings, setListings] = useState<iListings[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [activeProperties, setActiveProperties] = useState(0);
  const [inactiveProperties, setInactiveProperties] = useState(0);

  const calculateStats = (data: iListings[]) => {
    const active = data.filter(
      (listing) => listing.activelisting === true
    ).length;
    const inactive = data.filter(
      (listing) => listing.activelisting === false
    ).length;

    setActiveProperties(active);
    setInactiveProperties(inactive);
  };

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings();
        setListings(data);
        calculateStats(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;
      setIsSidebarOpen(isDesktop);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Statistical Calculations for DashboardStats
  const totalValue = listings.reduce(
    (sum, listing) => sum + listing.propertyprice,
    0
  );

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
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
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
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <DashboardStats
              title="Total Value"
              value={`$ ${totalValue.toLocaleString()}`}
              icon={<DollarSign size={24} className="text-emerald-500" />}
            />
            <DashboardStats
              title="Total Properties"
              value={listings.length}
              icon={<House size={24} className="text-blue-500" />}
            />
            <DashboardStats
              title="Active Properties"
              value={activeProperties}
              icon={<Power size={24} className="text-lime-300" />}
            />
            <DashboardStats
              title="Inactive Properties"
              value={inactiveProperties}
              icon={<PowerOff size={24} className="text-red-400" />}
            />
          </div>

          {/* Active Properties Header + Table */}
          <div className="rounded-[5px] border border-gray-700">
            <h1 className="text-lg font-semibold text-white bg-gradient-to-tr from-[#010102] to-[#1e293b] px-6 py-6 border-b border-gray-800 activeFont">
              Active Properties
            </h1>
            <div className="overflow-x-auto overflow-y-scroll h-[calc(100vh-20rem)] no-scrollbar">
              <table className="min-w-full bg-gradient-to-tr from-[#010102] to-[#1e293b] table-fixed">
                <thead className="border-b-2 border-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-[0.85em] text-gray-400 font-semibold tracking-wider activeFont w-64">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-[0.85em] text-gray-400 font-semibold tracking-wider activeFont w-64">
                      Listing Name
                    </th>
                    <th className="px-6 py-3 text-left text-[0.85em] text-gray-400 font-semibold tracking-wider activeFont w-32 md:table-cell">
                      Price
                    </th>
                    <div className="flex flex-row justify-end">
                      <th className="px-6 py-3 text-left text-[0.85em] text-gray-400 font-semibold tracking-wider activeFont w-40">
                        Actions
                      </th>
                    </div>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {listings.map((listing) => (
                    <tr key={listing.id}>
                      <td className="px-4 py-2 whitespace-nowrap w-20">
                        <img
                          src={listing.mainimage}
                          alt={listing.propertytitle}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-normal w-64">
                        <div className="text-s text-gray-100 font-bold">
                          <span className="md:text-m text-gray-100 font-semibold activeFont">
                            {listing.propertytitle}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap w-32 md:table-cell">
                        <span className="text-m text-gray-100 font-semibold activeFont">
                          ${listing.propertyprice.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap w-40">
                        <div className="flex flex-row items-center justify-end">
                          <button className="bg-teal-600 text-white px-3 py-1 rounded mr-2 hover:bg-teal-800">
                            Edit
                          </button>
                          <button className="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600">
                            Delist
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
