import { useEffect, useState } from "react";
import NavigationMenu from "../components/NavigationMenu";
import "../styles/dashboard.css";
import { getListings } from "../services/listingsService";
import { DashboardStats } from "../components/DashboardStats";
import { DollarSign, Power, House, PowerOff } from "lucide-react";
import { iListings } from "../models/iListings";
import InactiveProperties from "../components/InactiveProperties";
import { supabase } from "../supabaseClient";
import AddListingDialog from "../components/AddListingDialog";
import AddAgentDialog from "../components/AddAgentDialog";
import { iAgent } from "../models/iAgent";
import EditListingDialog from "../components/EditListingDialog";
import { toast } from "sonner";

export const InactivePropertiesPage = () => {
  const [listings, setListings] = useState<iListings[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [inactiveValue, setInactiveValue] = useState(0);
  const [activeProperties, setActiveProperties] = useState(0);
  const [inactiveProperties, setInactiveProperties] = useState(0);
  const [isNewListingDialogOpen, setIsNewListingDialogOpen] = useState(false);
  const [isAddAgentDialogOpen, setIsAddAgentDialogOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<iListings | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isDesktop = windowWidth >= 1024;

  const calculateStats = (data: iListings[]) => {
    const active = data.filter((listing) => listing.activelisting).length;
    const inactive = data.filter((listing) => !listing.activelisting).length;
    const totalInactiveValue = data
      .filter((listing) => !listing.activelisting)
      .reduce((sum, listing) => sum + listing.propertyprice, 0);

    setActiveProperties(active);
    setInactiveProperties(inactive);
    setInactiveValue(totalInactiveValue);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      const isNowDesktop = window.innerWidth >= 1024;
      setIsSidebarOpen(isNowDesktop);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleNewListing = () => {
    setIsNewListingDialogOpen(true);
  };

  const handleEditButtonClick = (listing: iListings) => {
    setEditingListing(listing);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddAgent = (_: iAgent) => {
    setIsAddAgentDialogOpen(false);
  };

  const handleNewAgent = () => {
    setIsAddAgentDialogOpen(true);
  };

  const relistFunction = async (propertyId: string) => {
    try {
      const { error } = await supabase
        .from("properties")
        .update({ activelisting: true })
        .eq("id", propertyId);

      if (error) throw error;

      // Updating listings state by mapping through and updating the specific listing
      setListings((prevListings) => {
        const updatedListings = prevListings.map((listing) => {
          if (listing.id === propertyId) {
            return { ...listing, activelisting: true };
          }
          return listing;
        });

        calculateStats(updatedListings);
        return updatedListings;
      });

      toast.success("Successfully relisted property");
    } catch (error) {
      console.error("Error relisting property", error);
      toast.error("Failed to relist property");
    }
  };

  //Used a demo function for this demo - remove for future use!
  const handleDeleteDemo = () => {
    console.log('Disabled Operation on this Demo');
  }

  const handleDelete = async (propertyId: string) => {
    try {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", propertyId);

      if (error) throw error;

      setListings((prevListings) => {
        const updatedListings = prevListings.filter(
          (listing) => listing.id !== propertyId
        );
        return updatedListings;
      });
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };
  //Also remove this obviously!
  console.log(handleDelete);
  

  useEffect(() => {
    calculateStats(listings);
  }, [listings]);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#222e40]">
      <NavigationMenu
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onNewAgentClick={handleNewAgent}
        onNewListingClick={handleNewListing}
      />

      <div
        className="p-4 overflow-y-auto"
        style={{
          marginLeft: isDesktop ? (isSidebarOpen ? "16rem" : "4rem") : "0",
          marginTop: "3.5rem",
          height: `calc(100vh - 3.5rem)`,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <DashboardStats
            title="Total Inactive Value"
            value={`$ ${inactiveValue.toLocaleString()}`}
            icon={<DollarSign size={24} className="text-red-500" />}
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

        {/* Edit Listing Dialog */}
        {editingListing && (
          <EditListingDialog
            listing={editingListing}
            onClose={() => setEditingListing(null)}
            onSave={(updatedListing) => {
              setListings((prevListings) =>
                prevListings.map((listing) =>
                  listing.id === updatedListing.id ? updatedListing : listing
                )
              );
              setEditingListing(null);
            }}
          />
        )}

        {/* Add New Listing Dialog */}
        {isNewListingDialogOpen && (
          <AddListingDialog
            onClose={() => setIsNewListingDialogOpen(false)}
            onAdd={(newListing) => {
              setListings((prevListings) => [newListing, ...prevListings]);
            }}
          />
        )}

        {/* Add Agent Dialog */}
        {isAddAgentDialogOpen && (
          <AddAgentDialog
            onClose={() => setIsAddAgentDialogOpen(false)}
            onAdd={handleAddAgent}
          />
        )}

        <InactiveProperties
          listings={listings}
          handleEditButtonClick={handleEditButtonClick}
          relistFunction={relistFunction}
          handleDelete={handleDeleteDemo}
        />
      </div>
    </div>
  );
};

export default InactivePropertiesPage;
