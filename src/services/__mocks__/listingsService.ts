import { iListings } from '../../models/iListings';

export const getListings = async (): Promise<iListings[]> => {
  return Promise.resolve([
    {
      id: "1",
      propertytitle: "Cozy Apartment",
      propertydescription: "A lovely 2-bedroom apartment in central Stockholm.",
      propertyprice: 2000000,
      activelisting: true,
      mainimage: "https://example.com/images/apartment_main.jpg",
      additionalimages: [
        "https://example.com/images/apartment_extra1.jpg",
        "https://example.com/images/apartment_extra2.jpg"
      ],
      category: ["apartment", "sale"]
    },
    {
      id: "2",
      propertytitle: "Modern Villa",
      propertydescription: "A spacious and modern villa with a large garden.",
      propertyprice: 5000000,
      activelisting: false,
      mainimage: "https://example.com/images/villa_main.jpg",
      additionalimages: [
        "https://example.com/images/villa_extra1.jpg"
      ],
      category: ["house", "sale", "luxury"]
    }
  ]);
};
