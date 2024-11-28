import { iListings } from "./iListings";

export interface EditListingDialogProps {
    listing: iListings;
    onClose: () => void;
    onSave: (updatedListing: iListings) => void;
  }