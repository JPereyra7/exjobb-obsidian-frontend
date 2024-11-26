// Dashboard.tsx

import { useEffect, useState } from "react";
import { SidebarComponent } from "../components/Sidebar";
import "../styles/dashboard.css";
import { getListings } from "../services/listingsService";
import Navbar from "../components/Navbar";
import { DashboardStats } from "../components/DashboardStats";
import { DollarSign, Power, House, PowerOff } from "lucide-react";
import { supabase } from "../supabaseClient";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
} from "../../components/ui/dialog";
import { toast } from "sonner";

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
  const [editingListing, setEditingListing] = useState<iListings | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  // Function to handle Edit button click
  const handleEditButtonClick = (listing: iListings) => {
    setEditingListing(listing);
    setIsDialogOpen(true);
  };

  // Save Edited Property
  const saveEditedProperty = async () => {
    if (!editingListing) return;

    try {
      const updatedData = {
        propertytitle: editingListing.propertytitle,
        propertydescription: editingListing.propertydescription,
        propertyprice: Number(editingListing.propertyprice),
      };

      const { error } = await supabase
        .from("properties")
        .update(updatedData)
        .eq("id", editingListing.id);

      if (error) throw error;

      // Update the listing in the frontend state
      setListings((prevListings) =>
        prevListings.map((listing) =>
          listing.id === editingListing.id
            ? {
                ...listing,
                ...updatedData,
                propertyprice: Number(editingListing.propertyprice),
              }
            : listing
        )
      );

      // Close the dialog and reset editing state
      setIsDialogOpen(false);
      toast.success("Succesfully edited listing");
      setEditingListing(null);
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  // Handle input changes
  const handleInputChange = (
    field: keyof Pick<
      iListings,
      "propertytitle" | "propertydescription" | "propertyprice"
    >,
    value: string
  ) => {
    if (!editingListing) return;

    setEditingListing((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [field]: field === "propertyprice" ? Number(value) || 0 : value,
      };
    });
  };

  // Delist function (Supabase handler) + Recalculate stats and remove table row
  const delistFunction = async (propertyId: string) => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .update({ activelisting: false })
        .eq("id", propertyId);

      if (error) throw error;

      console.log("Property delisted", data);

      // Update the listing state
      setListings((prevListings) => {
        const updatedListings = prevListings.map((listing) => {
          if (listing.id === propertyId) {
            return { ...listing, activelisting: false };
          }
          return listing;
        });
        // Update the stats
        calculateStats(updatedListings);
        return updatedListings;
      });
    } catch (error) {
      console.error("Error delisting property", error);
    }
  };

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
  const totalValue = listings
    .filter((listing) => listing.activelisting)
    .reduce((sum, listing) => sum + listing.propertyprice, 0);

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
                  {listings
                    .filter((listing) => listing.activelisting)
                    .map((listing) => (
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
                            <span className="text-sm md:text-base text-gray-100 font-semibold activeFont">
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
                            {/* Dialog Component for Edit */}

                            <Dialog
                              open={isDialogOpen}
                              onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (!open) setEditingListing(null);
                              }}
                            >
                              <DialogTrigger asChild>
                                <button
                                  onClick={() => handleEditButtonClick(listing)}
                                  className="bg-teal-600 text-white px-3 py-1 rounded mr-2 hover:bg-teal-800"
                                >
                                  Edit
                                </button>
                              </DialogTrigger>
                              <DialogPortal>
                                <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
                                <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-[90vw] md:w-[500px] h-auto md:h-auto max-h-[85vh] bg-gradient-to-tr from-[#010102] to-[#1e293b] rounded-lg shadow-lg border-slate-700">
                                  <div className="overflow-y-auto max-h-[85vh] p-6">
                                    <DialogHeader>
                                      <DialogTitle className="text-xl font-semibold mb-2 text-slate-400 activeFont tracking-normal">
                                        Edit Property
                                      </DialogTitle>
                                    </DialogHeader>

                                    {editingListing && (
                                      <div className="space-y-4">
                                        <div>
                                          <label className="block text-sm font-medium text-gray-200 activeFont">
                                            Property Title
                                          </label>
                                          <input
                                            type="text"
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                            value={editingListing.propertytitle}
                                            onChange={(e) =>
                                              handleInputChange(
                                                "propertytitle",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-sm font-medium text-gray-200 activeFont">
                                            Property Description
                                          </label>
                                          <textarea
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                            value={
                                              editingListing.propertydescription
                                            }
                                            onChange={(e) =>
                                              handleInputChange(
                                                "propertydescription",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-sm font-medium text-gray-200 activeFont">
                                            Property Price
                                          </label>
                                          <input
                                            type="number"
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                            value={editingListing.propertyprice}
                                            onChange={(e) =>
                                              handleInputChange(
                                                "propertyprice",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="mt-6 flex justify-end space-x-2">
                                      <button
                                        className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-800"
                                        onClick={saveEditedProperty}
                                      >
                                        Save
                                      </button>
                                      <DialogTrigger asChild>
                                        <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                                          Cancel
                                        </button>
                                      </DialogTrigger>
                                    </div>
                                  </div>
                                </DialogContent>
                              </DialogPortal>
                            </Dialog>

                            {/* Delist Button */}
                            <button
                              onClick={() => delistFunction(listing.id)}
                              className="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600"
                            >
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
