import { iListings } from "./iListings";

export interface ActivePropertiesProps {
    listings: iListings[];
    handleEditButtonClick: (listing: iListings) => void;
    delistFunction: (propertyId: string) => void;
  }