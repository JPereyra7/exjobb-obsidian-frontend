import { useState } from "react";
import { Sidebar } from "flowbite-react";
import { PiSignOutBold } from "react-icons/pi";
import { GoDatabase } from "react-icons/go";
import { RiAddBoxLine } from "react-icons/ri";
import {
  HiChartPie,
  HiInbox,
  HiMenu,
  HiShoppingBag,
  HiTable,
  HiUser,
} from "react-icons/hi";
import Obsidian from "../assets/Obsidian.png";
import { useNavigate } from "react-router-dom";

export function SidebarComponent() {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const signOut = () => {
    navigate("/");
  };

  return (
    <div className="flex-shrink-0 dark">
      <Sidebar
        aria-label="Expandable sidebar"
        className={`transition-all duration-300 min-h-full ${
          isExpanded ? "w-64" : "w-16"
        }`}
      >
        {/* Hamburger Menu */}
        <div className="flex items-center justify-between">
          {/* Custom Sidebar Logo */}
          <div className={`flex items-center justify-center`}>
            <img
              src={Obsidian}
              alt="Obsidian Logo"
              className={`transition-all duration-300 ${
                isExpanded ? "w-36 h-36" : "hidden"
              }`}
            />
          </div>

          <div className="flex justify-end items-center py-2">
            <button
              onClick={toggleSidebar}
              className="text-white rounded-md hover:bg-gray-700 p-2"
            >
              <HiMenu size={24} />
            </button>
          </div>
        </div>

        {/* Sidebar Items */}
        <Sidebar.Items className="flex">
          <Sidebar.ItemGroup>
            <Sidebar.Item href="#" icon={HiChartPie}>
              {isExpanded && "Dashboard"}
            </Sidebar.Item>

            {/* Properties Section */}
            {isExpanded ? (
              <Sidebar.Collapse label="Properties" icon={GoDatabase}>
                <Sidebar.Item
                  className="cursor-pointer"
                  icon={RiAddBoxLine}
                >
                  New Listing
                </Sidebar.Item>
              </Sidebar.Collapse>
            ) : (
              <Sidebar.Item icon={GoDatabase} />
            )}

            <Sidebar.Item href="#" icon={HiInbox}>
              {isExpanded && "Inbox"}
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiUser}>
              {isExpanded && "Users"}
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiShoppingBag}>
              {isExpanded && "Products"}
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiTable}>
              {isExpanded && "Sign Up"}
            </Sidebar.Item>
            <div onClick={signOut}>
              <Sidebar.Item href="#" icon={PiSignOutBold}>
                {isExpanded && "Sign Out"}
              </Sidebar.Item>
            </div>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}
