import { getListings } from '../services/listingsService';

jest.mock('../services/listingsService.ts');

describe('getListings', () => {
  test('should return a list of mock listings', async () => {
    const listings = await getListings();
    expect(listings).toBeDefined();
    expect(Array.isArray(listings)).toBe(true);
    expect(listings).toHaveLength(2);

    const firstListing = listings[0];
    expect(firstListing.id).toBe("1");
    expect(firstListing.propertytitle).toBe("Cozy Apartment");
    expect(firstListing.propertydescription).toBe("A lovely 2-bedroom apartment in central Stockholm.");
    expect(firstListing.propertyprice).toBe(2000000);
    expect(firstListing.activelisting).toBe(true);
    expect(firstListing.mainimage).toBe("https://example.com/images/apartment_main.jpg");
    expect(firstListing.additionalimages).toEqual([
      "https://example.com/images/apartment_extra1.jpg",
      "https://example.com/images/apartment_extra2.jpg"
    ]);
    expect(firstListing.category).toEqual(["apartment", "sale"]);

    const secondListing = listings[1];
    expect(secondListing.id).toBe("2");
    expect(secondListing.propertytitle).toBe("Modern Villa");
    expect(secondListing.propertydescription).toBe("A spacious and modern villa with a large garden.");
    expect(secondListing.propertyprice).toBe(5000000);
    expect(secondListing.activelisting).toBe(false);
    expect(secondListing.mainimage).toBe("https://example.com/images/villa_main.jpg");
    expect(secondListing.additionalimages).toEqual([
      "https://example.com/images/villa_extra1.jpg"
    ]);
    expect(secondListing.category).toEqual(["house", "sale", "luxury"]);
  });
});
