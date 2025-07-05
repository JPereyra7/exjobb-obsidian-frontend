import { useEffect, useState } from "react";
import NavigationMenu from "../components/NavigationMenu";
import "../styles/dashboard.css";
import { getListings } from "../services/listingsService";
import { DashboardStats } from "../components/DashboardStats";
import { DollarSign, Power, House, PowerOff } from "lucide-react";
import { supabase } from "../supabaseClient";
import { iListings } from "../models/iListings";
import ActiveProperties from "../components/ActiveProperties";
import EditListingDialog from "../components/EditListingDialog";
import AddListingDialog from "../components/AddListingDialog";
import AgentsList from "../components/AgentsList";
import AddAgentDialog from "../components/AddAgentDialog";
import EditAgentDialog from "../components/EditAgentDialog";
import { iAgent } from "../models/iAgent";
import { getAgents } from "../services/agentsService";
import { toast } from "sonner";
import { ObsidianSpinner } from "../components/ObsidianSpinner";

export const Dashboard = () => {
  const [listings, setListings] = useState<iListings[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [activeProperties, setActiveProperties] = useState(0);
  const [inactiveProperties, setInactiveProperties] = useState(0);
  const [editingListing, setEditingListing] = useState<iListings | null>(null);
  const [isNewListingDialogOpen, setIsNewListingDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [agents, setAgents] = useState<iAgent[]>([]);
  const [editingAgent, setEditingAgent] = useState<iAgent | null>(null);
  const [isAddAgentDialogOpen, setIsAddAgentDialogOpen] = useState(false);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isDesktop = windowWidth >= 1024;

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

  //  Fetch Agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        console.log("Agent URL:", import.meta.env.VITE_BASE_AGENTSURL);
        const data = await getAgents();
        console.log("Fetched Agents Data:", data);
        setAgents(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchAgents();
  }, []);

const deleteAgent = () => {
  toast.warning('Disabled Operation on this demo')
}

  // const deleteAgent = async (agentId: string) => {
  //   try {
  //     const { error } = await supabase
  //       .from("agents")
  //       .delete()
  //       .eq("id", agentId);
  //     if (error) throw error;

  //     setAgents((prevAgents) =>
  //       prevAgents.filter((agent) => agent.id !== agentId)
  //     );

  //     console.log("Agent deleted successfully");
  //   } catch (error) {
  //     console.error("Error deleting agent:", error);
  //   }
  // };

  const handleEditAgentButtonClick = (agent: iAgent) => {
    setEditingAgent(agent);
  };

  const handleSaveEditedAgent = (updatedAgent: iAgent) => {
    setAgents((prevAgents) =>
      prevAgents.map((agent) =>
        agent.id === updatedAgent.id ? updatedAgent : agent
      )
    );
    setEditingAgent(null);
  };

  const handleAddAgent = (newAgent: iAgent) => {
    setAgents((prevAgents) => [newAgent, ...prevAgents]);
    setIsAddAgentDialogOpen(false);
  };

  // Spinner timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Delist function
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
        // Update the stats & add toaster message
        toast.success('Property delisted')
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
      setWindowWidth(window.innerWidth);
      const isNowDesktop = window.innerWidth >= 1024;
      setIsSidebarOpen(isNowDesktop);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Statistical Calculations for DashboardStats
  const totalValue = listings
    .filter((listing) => listing.activelisting)
    .reduce((sum, listing) => sum + listing.propertyprice, 0);

  // Handle New Listing Click from Sidebar
  const handleNewListing = () => {
    setIsNewListingDialogOpen(true);
  };

  const handleNewAgent = () => {
    setIsAddAgentDialogOpen(true);
  };

  // Function to handle Edit button click
  const handleEditButtonClick = (listing: iListings) => {
    setEditingListing(listing);
  };

  return (
    <div className="min-h-screen bg-[#222e40]">
      {isLoading ? (
        <ObsidianSpinner />
      ) : (
        <>
          {/* Navigation Menu */}
          <NavigationMenu
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            onNewListingClick={handleNewListing}
            onNewAgentClick={handleNewAgent}
          />

          {/* Main Content */}
          <div
            className="p-4 overflow-y-auto no-scrollbar"
            style={{
              marginLeft: isDesktop ? (isSidebarOpen ? "16rem" : "4rem") : "0",
              marginTop: "3.5rem", // Adjust according to Navbar's height
              height: `calc(100vh - 3.5rem)`,
            }}
          >
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

            {/* Active Properties */}
            <ActiveProperties
              listings={listings}
              handleEditButtonClick={handleEditButtonClick}
              delistFunction={delistFunction}
            />

            {/* Edit Listing Dialog */}
            {editingListing && (
              <EditListingDialog
                listing={editingListing}
                onClose={() => setEditingListing(null)}
                onSave={(updatedListing) => {
                  setListings((prevListings) =>
                    prevListings.map((listing) =>
                      listing.id === updatedListing.id
                        ? updatedListing
                        : listing
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
                  calculateStats([newListing, ...listings]);
                }}
              />
            )}

            {/* Agents List */}
            <AgentsList
              agents={agents}
              handleEditButtonClick={handleEditAgentButtonClick}
              deleteAgent={deleteAgent}
            />

            {/* Edit Agent Dialog */}
            {editingAgent && (
              <EditAgentDialog
                agent={editingAgent}
                onClose={() => setEditingAgent(null)}
                onSave={handleSaveEditedAgent}
              />
            )}

            {/* Add Agent Dialog */}
            {isAddAgentDialogOpen && (
              <AddAgentDialog
                onClose={() => setIsAddAgentDialogOpen(false)}
                onAdd={handleAddAgent}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
