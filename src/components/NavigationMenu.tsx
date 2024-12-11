import { useEffect, useState } from "react";
import { HiMenu } from "react-icons/hi";
import Obsidian from "../assets/ObsidianCropped.png";
import { User } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import { toast } from "sonner";
import { Sidebar } from "flowbite-react";
import { PiSignOutBold } from "react-icons/pi";
import { GoDatabase } from "react-icons/go";
import { RiAddBoxLine } from "react-icons/ri";
import "../styles/sidebar.css";
import {
  HiChartPie,
  HiUser,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { CustomFlowbiteTheme } from "flowbite-react";
import { NavigationMenuProps } from "../models/NavbarProps";

const NavigationMenu = ({
  isSidebarOpen,
  setIsSidebarOpen,
  onNewListingClick,
  onNewAgentClick,
}: NavigationMenuProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userImage, setUserImage] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [originalFirstName, setOriginalFirstName] = useState<string>("");
  const [originalLastName, setOriginalLastName] = useState<string>("");
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isDesktop = windowWidth >= 1024;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user from Supabase", error);
        return;
      }
      if (user) {
        setUser(user);
        const { data, error } = await supabase
          .from("users")
          .select("userimage, firstname, surname")
          .eq("id", user.id)
          .single();
        if (error) {
          console.error("Error fetching user data:", error);
        } else {
          // Append timestamp to userimage for cache issues when updating profile image
          const timestamp = new Date().getTime();
          const userImageWithTimestamp = data.userimage
            ? `${data.userimage}?t=${timestamp}`
            : "";

          setUserImage(userImageWithTimestamp);
          setFirstName(data.firstname || "");
          setLastName(data.surname || "");
          setOriginalFirstName(data.firstname || "");
          setOriginalLastName(data.surname || "");
        }
      }
    };
    fetchUserData();
  }, []);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && user) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Error uploading image to bucket", uploadError);
        toast.error("Error uploading image");
      } else {
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);
        const publicUrl = publicUrlData.publicUrl;

        // Append timestamp to publicUrl
        const timestamp = new Date().getTime();
        const publicUrlWithTimestamp = `${publicUrl}?t=${timestamp}`;

        const { error: updateError } = await supabase
          .from("users")
          .update({ userimage: publicUrl })
          .eq("id", user.id);

        if (updateError) {
          console.error("Error updating user image:", updateError);
          toast.error("Error updating profile image");
        } else {
          setUserImage(publicUrlWithTimestamp);
          toast.success("Profile image updated");
        }
      }
    }
  };

  const handleSave = async () => {
    if (user) {
      const { error } = await supabase
        .from("users")
        .update({ firstname: firstName, surname: lastName })
        .eq("id", user.id);
      if (error) {
        console.error("Error updating user name:", error);
        toast.error("Error updating user name");
      } else {
        toast.success("User name updated");
        setOriginalFirstName(firstName);
        setOriginalLastName(lastName);
        setIsSheetOpen(false);
      }
    }
  };

  const handleCancel = () => {
    setIsSheetOpen(false);
  };

  const signOut = () => {
    navigate("/");
  };

  // Custom theme for Flowbite's sidebar
  const customTheme: CustomFlowbiteTheme["sidebar"] = {
    root: {
      base: "h-full font",
      collapsed: {
        on: "w-16",
        off: "w-64",
      },
      inner:
        "h-full overflow-y-auto overflow-x-hidden bg-gradient-to-tr from-[#010102] to-[#1e293b] py-4 px-3 no-scrollbar",
    },
    collapse: {
      button:
        "group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-200 transition duration-75 hover:bg-gray-700 hover:text-white",
      icon: {
        base: "h-6 w-6 text-gray-300 transition duration-75 group-hover:text-white",
        open: {
          off: "",
          on: "text-gray-200",
        },
      },
      label: {
        base: "ml-3 flex-1 whitespace-nowrap text-left",
        icon: {
          base: "h-6 w-6 transition ease-in-out delay-0 hover:text-white",
          open: {
            on: "rotate-180",
            off: "",
          },
        },
      },
    },
    item: {
      base: "flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-200 hover:bg-gray-700 hover:text-white",
      active: "bg-gray-700 text-gray-200",
      collapsed: {
        insideCollapse: "group w-full pl-8 transition duration-75",
        noIcon: "font-bold",
      },
      content: {
        base: "px-3 flex-1 whitespace-nowrap",
      },
      icon: {
        base: "h-6 w-6 flex-shrink-0 text-gray-300 transition duration-75 group-hover:text-white",
        active: "text-gray-200",
      },
    },
    items: {
      base: "",
    },
    itemGroup: {
      base: "mt-4 space-y-2",
    },
  };

  const navigatetoInactive = () => {
    navigate("/inactive")
  }

  const navigatetoDashboard = () => {
    navigate("/dashboard")
  }

  return (
    <>
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-tr from-[#010102] to-[#1e293b] border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white p-2 hover:bg-gray-700 rounded-md"
          >
            <HiMenu size={24} />
          </button>
          <img src={Obsidian} alt="Obsidian Logo" className="lg:h-6 h-5 ml-3" />
        </div>

        {/* Avatar and Sheet */}
        <div>
          <Sheet
            open={isSheetOpen}
            onOpenChange={(open) => setIsSheetOpen(open)}
          >
            <SheetTrigger asChild>
              <button
                onClick={() => {
                  setIsSheetOpen(true);
                  setFirstName(originalFirstName);
                  setLastName(originalLastName);
                }}
              >
                <div className="flex flex-row items-center gap-3">
                  <p className="text-md lg:text-[17px] text-white activeFont font-semibold">
                    {firstName}
                  </p>

                  <Avatar className="cursor-pointer mr-6">
                    {userImage ? (
                      <AvatarImage src={userImage} alt="User Image" />
                    ) : (
                      <AvatarFallback className="text-white">
                        {user && user.email
                          ? user.email.charAt(0).toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-gradient-to-tr from-[#010102] to-[#1e293b] border-slate-800"
            >
              <SheetHeader>
                <SheetTitle className="text-slate-200 activeFont">
                  User Settings
                </SheetTitle>
              </SheetHeader>
              {/* User Settings Content */}
              <div className="mt-4 flex flex-col items-center">
                {/* Avatar Image */}
                <Avatar className="w-24 h-24">
                  {userImage ? (
                    <AvatarImage src={userImage} alt="User Image" />
                  ) : (
                    <AvatarFallback className="text-white text-4xl bg-slate-700">
                      {user && user.email
                        ? user.email.charAt(0).toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                {/* Upload New Profile Image */}
                <label className="block text-sm font-medium text-slate-200 mt-4 activeFont">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-7 block w-full text-slate-200 border border-slate-700"
                  onChange={handleImageUpload}
                />
                {/* First Name Input */}
                <div className="mt-6 w-full">
                  <label className="block text-sm font-medium text-slate-200 activeFont">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                {/* Last Name Input */}
                <div className="mt-4 w-full">
                  <label className="block text-sm font-medium text-slate-200 activeFont">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-2 w-full">
                  <button
                    className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-800"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Sidebar menyn*/}
      <div
        className={`fixed left-0 z-30 h-full transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          marginTop: "",
        }}
      >
        <div className="flex-shrink-0 h-full">
          <Sidebar
            aria-label="Sidebar navigation"
            theme={customTheme}
            className={`h-full transition-all duration-300 border-r border-gray-700 ${
              isSidebarOpen ? "w-64" : "w-16"
            }`}
          >
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <div onClick={navigatetoDashboard} className="cursor-pointer">
                <Sidebar.Item icon={HiChartPie}>
                  {isSidebarOpen && "Dashboard"}
                </Sidebar.Item>
                </div>

                {isSidebarOpen ? (
                  <Sidebar.Collapse label="Properties" icon={GoDatabase}>
                    <Sidebar.Item
                      className="cursor-pointer"
                      icon={RiAddBoxLine}
                      onClick={onNewListingClick}
                    >
                      New Listing
                    </Sidebar.Item>
                    <div onClick={navigatetoInactive}>
                    <Sidebar.Item className="cursor-pointer">
                      Inactive Listings
                    </Sidebar.Item>
                    </div>
                  </Sidebar.Collapse>
                ) : (
                  <Sidebar.Item icon={GoDatabase} />
                )}
                {isSidebarOpen ? (
                  <Sidebar.Collapse label="Agents" icon={HiUser}>
                    <Sidebar.Item
                      className="cursor-pointer"
                      icon={RiAddBoxLine}
                      onClick={onNewAgentClick}
                    >
                      Add Agent
                    </Sidebar.Item>
                  </Sidebar.Collapse>
                ) : (
                  <Sidebar.Item icon={HiUser} />
                )}
                <div className="cursor-pointer" onClick={() => setIsSheetOpen(true)}>
                  <div onClick={() => setIsSidebarOpen(false)}>
                <Sidebar.Item icon={HiUser}>
                  {isSidebarOpen && "User Settings"}
                </Sidebar.Item>
                  </div>
                </div>
                <div className="cursor-pointer" onClick={signOut}>
                  <Sidebar.Item icon={PiSignOutBold}>
                    {isSidebarOpen && "Sign Out"}
                  </Sidebar.Item>
                </div>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </div>
      </div>

      {/* Overlay for mobile only */}
      {isSidebarOpen && !isDesktop && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default NavigationMenu;
