import { Sidebar } from "flowbite-react";
import { PiSignOutBold } from "react-icons/pi";
import { GoDatabase } from "react-icons/go";
import { RiAddBoxLine } from "react-icons/ri";
import '../styles/sidebar.css'
import {
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { CustomFlowbiteTheme } from "flowbite-react";
import { SidebarProps } from "../models/SidebarProps";

// Custom theme for Flowbiteäs sidebar
const customTheme: CustomFlowbiteTheme['sidebar'] = {
  root: {
    base: "h-full font",
    collapsed: {
      on: "w-16",
      off: "w-64"
    },
    inner: "h-full overflow-y-auto overflow-x-hidden bg-gradient-to-tr from-[#010102] to-[#1e293b] py-4 px-3"
  },
  collapse: {
    button: "group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-200 transition duration-75 hover:bg-gray-700 hover:text-white",
    icon: {
      base: "h-6 w-6 text-gray-300 transition duration-75 group-hover:text-white",
      open: {
        off: "",
        on: "text-gray-200"
      }
    },
    label: {
      base: "ml-3 flex-1 whitespace-nowrap text-left",
      icon: {
        base: "h-6 w-6 transition ease-in-out delay-0 hover:text-white",
        open: {
          on: "rotate-180",
          off: ""
        }
      }
    }
  },
  item: {
    base: "flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-200 hover:bg-gray-700 hover:text-white",
    active: "bg-gray-700 text-gray-200",
    collapsed: {
      insideCollapse: "group w-full pl-8 transition duration-75",
      noIcon: "font-bold"
    },
    content: {
      base: "px-3 flex-1 whitespace-nowrap"
    },
    icon: {
      base: "h-6 w-6 flex-shrink-0 text-gray-300 transition duration-75 group-hover:text-white",
      active: "text-gray-200"
    }
  },
  items: {
    base: ""
  },
  itemGroup: {
    base: "mt-4 space-y-2"
  }
};

export function SidebarComponent({ isExpanded, onNewListingClick }: SidebarProps) {
  const navigate = useNavigate();

  const signOut = () => {
    navigate("/");
  };

  return (
    <div className="flex-shrink-0 h-full">
      <Sidebar
        aria-label="Sidebar navigation"
        theme={customTheme}
        className={`min-h-full transition-all duration-300 border-r border-gray-700 ${
          isExpanded ? 'w-64' : 'w-16'
        }`}
      >
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item href="#" icon={HiChartPie}>
              {isExpanded && "Dashboard"}
            </Sidebar.Item>

            {isExpanded ? (
              <Sidebar.Collapse label="Properties" icon={GoDatabase}>
                <Sidebar.Item
                  className="cursor-pointer"
                  icon={RiAddBoxLine}
                  onClick={onNewListingClick}
                >
                  New Listing
                </Sidebar.Item>
                <Sidebar.Item
                  className="cursor-pointer"
                >
                  Inactive Listings
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