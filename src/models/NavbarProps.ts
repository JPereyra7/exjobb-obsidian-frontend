export interface NavbarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
  }

  export interface NavigationMenuProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    onNewListingClick: () => void;
    onNewAgentClick: () => void;
  }