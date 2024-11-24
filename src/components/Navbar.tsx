import { HiMenu } from "react-icons/hi";
import Obsidian from "../assets/ObsidianCropped.png";


interface NavbarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
  }

export const Navbar = ({ isSidebarOpen, setIsSidebarOpen }: NavbarProps) => {
    return(
        <>
              {/* Top Navbar */}
      <div className="bg-[#0f172a] border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white p-2 hover:bg-gray-700 rounded-md"
          >
            <HiMenu size={24} />
          </button>
          <img
            src={Obsidian}
            alt="Obsidian Logo"
            className="lg:h-6 h-5 ml-3"
          />
        </div>
      </div>
        </>
    )
}
export default Navbar