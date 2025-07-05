import { useEffect, useState } from "react";
import NavigationMenu from "../components/NavigationMenu";
import { getListings } from "../services/listingsService";
import { iListings } from "../models/iListings";
import AddListingDialog from "../components/AddListingDialog";
import AddAgentDialog from "../components/AddAgentDialog";
import { iAgent } from "../models/iAgent";
import EditListingDialog from "../components/EditListingDialog";
import { ChatComponent } from "../components/ChatComponent";
import { getAgents } from "../services/agentsService";

export const Chat = () => {
  const [listings, setListings] = useState<iListings[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [, setInactiveValue] = useState(0);
  const [, setActiveProperties] = useState(0);
  const [, setInactiveProperties] = useState(0);
  const [isNewListingDialogOpen, setIsNewListingDialogOpen] = useState(false);
  const [isAddAgentDialogOpen, setIsAddAgentDialogOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<iListings | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isDesktop = windowWidth >= 1024;
  const [agents, setAgents] = useState<iAgent[]>([]);

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

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await getAgents();
        setAgents(data);
      } catch (err) {
        console.error("Error fetching agents:", err);
      }
    };
    fetchAgents();
  }, []);

  const handleNewListing = () => {
    setIsNewListingDialogOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddAgent = (_: iAgent) => {
    setIsAddAgentDialogOpen(false);
  };

  const handleNewAgent = () => {
    setIsAddAgentDialogOpen(true);
  };

  useEffect(() => {
    calculateStats(listings);
  }, [listings]);

  return (
    <div className="min-h-full bg-[#222e40]">
      <NavigationMenu
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onNewAgentClick={handleNewAgent}
        onNewListingClick={handleNewListing}
      />

      <div
        style={{
          marginLeft: isDesktop ? (isSidebarOpen ? "16rem" : "4rem") : "0",
          marginTop: "3.5rem",
          height: `calc(100vh - 3.5rem)`,
        }}
      >
        <ChatComponent
          agents={agents}
          handleEditButtonClick={function (): void {
            throw new Error("Function not implemented.");
          }}
          deleteAgent={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
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
        {isNewListingDialogOpen && (
          <AddListingDialog
            onClose={() => setIsNewListingDialogOpen(false)}
            onAdd={(newListing) => {
              setListings((prevListings) => [newListing, ...prevListings]);
            }}
          />
        )}
        {isAddAgentDialogOpen && (
          <AddAgentDialog
            onClose={() => setIsAddAgentDialogOpen(false)}
            onAdd={handleAddAgent}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;
