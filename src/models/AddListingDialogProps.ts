import { iListings } from "./iListings";

export interface AddListingDialogProps {
    onClose: () => void;
    onAdd: (newListing: iListings) => void;
  }