import { iListings } from "./iListings";

export interface ActivePropertiesProps {
    listings: iListings[];
    handleEditButtonClick: (listing: iListings) => void;
    delistFunction: (propertyId: string) => void;
  }

  export interface InactivePropertiesProps extends Omit<ActivePropertiesProps, "delistFunction"> {
    relistFunction: (propertyId: string) => void;
    delistFunction?: (propertyId: string) => void;
    handleDelete: (propertyId: string) => void;
  }

  //Reason for the extend above is to remove the delist functionality before redefining it again in the extended interface. Had to use Omit for this! Also added a handleDelete prop