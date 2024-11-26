export interface iListings {
    id: string;
    propertytitle: string;
    propertydescription: string;
    propertyprice: number;
    activelisting: boolean;
    mainimage: string;
    additionalimages: string[];
  }

export interface iListingsResponse {
    success: boolean;
    message: string;
    data: iListings[];
  }