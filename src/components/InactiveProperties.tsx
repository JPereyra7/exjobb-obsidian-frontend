import { useEffect, useState } from "react";
import { InactivePropertiesProps } from "../models/ActivePropertiesProps";
import { toast } from "sonner";

const InactiveProperties = ({
  listings,
  handleEditButtonClick,
  relistFunction,
  handleDelete,
}: InactivePropertiesProps) => {
  const [localListings, setLocalListings] = useState(
    listings.filter((listing) => !listing.activelisting)
  );

  useEffect(() => {
    setLocalListings(listings.filter((listing) => !listing.activelisting));
  }, [listings]);

  // delete function
  const deleteListing = async (propertyId: string) => {
    try {
      await handleDelete(propertyId);
      //Uncomment this in the future
      // toast.success('Successfully deleted property');
      toast.warning('Disabled Operation on this Demo');
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error('Failed to delete item');
    }
  };

  return (
    <div className="rounded-[5px] border border-gray-700 gap-4 mb-6">
      <h1 className="text-lg font-semibold text-white bg-gradient-to-tr from-[#010102] to-[#1e293b] px-6 py-6 border-b border-gray-800 activeFont">
        Inactive Properties
      </h1>
      <div className="overflow-x-auto overflow-y-scroll h-[calc(100vh-20rem)] no-scrollbar">
        <table className="min-w-full bg-gradient-to-tr from-[#010102] to-[#1e293b] table-fixed">
          <thead className="border-b-2 border-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-[0.85em] text-gray-400 font-semibold tracking-wider activeFont w-64">
                Image
              </th>
              <th className="px-6 py-3 text-left text-[0.85em] text-gray-400 font-semibold tracking-wider activeFont w-64">
                Listing Name
              </th>
              <th className="px-6 py-3 text-left text-[0.85em] text-gray-400 font-semibold tracking-wider activeFont w-32 md:table-cell">
                Price
              </th>
              <th className="px-6 py-3 text-right text-[0.85em] text-gray-400 font-semibold tracking-wider activeFont w-40">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {localListings.length > 0 ? (
              localListings.map((listing) => (
                <tr key={listing.id}>
                  <td className="px-4 py-2 whitespace-nowrap w-20">
                    <img
                      src={listing.mainimage}
                      alt={listing.propertytitle}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-normal w-64">
                    <span className="text-sm md:text-base text-gray-100 font-semibold activeFont">
                      {listing.propertytitle}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-32 md:table-cell">
                    <span className="text-m text-gray-100 font-semibold activeFont">
                      ${listing.propertyprice.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-40 text-right">
                    <div className="flex flex-row items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditButtonClick(listing)}
                        className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => relistFunction(listing.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Relist
                      </button>
                      <button
                        onClick={() => deleteListing(listing.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-gray-400 py-4">
                  No inactive properties found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InactiveProperties;
