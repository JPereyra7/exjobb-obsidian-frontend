import '../styles/listingdialog.css'
import { useState, useEffect } from 'react';
import '../styles/listingdialog.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
  DialogClose,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { supabase } from '../supabaseClient';
import { toast } from 'sonner';
import { iListings } from '../models/iListings';
import { AddListingDialogProps } from '../models/AddListingDialogProps';

const AddListingDialog = ({ onClose, onAdd }: AddListingDialogProps) => {
  const [newListingTitle, setNewListingTitle] = useState('');
  const [newListingDescription, setNewListingDescription] = useState('');
  const [newListingPrice, setNewListingPrice] = useState('');
  const [newListingMainImage, setNewListingMainImage] = useState<File | null>(null);
  const [newListingAdditionalImages, setNewListingAdditionalImages] = useState<File[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // Changed to string

  useEffect(() => {
    // Fetch categories my Supabase db
    setCategories(['villas', 'spain', 'apartments']);
  }, []);

    //Use this for DEMO use!
    const handleAddListingDemo = () => {
      toast.warning('Disabled Operation on this demo')
    }

  const handleAddListing = async () => {
    try {
      // Validate inputs
      if (
        !newListingTitle ||
        !newListingDescription ||
        !newListingPrice ||
        !newListingMainImage
      ) {
        toast.warning('Please fill out all required fields and select your images.');
        return;
      }

      if (!selectedCategory) {
        toast.warning('Please select a category.');
        return;
      }

      // Upload main image to Supabase storage
      const mainImagePath = `properties/${Date.now()}_${newListingMainImage.name}`;
      const { error: mainImageUploadError } = await supabase.storage
        .from('images')
        .upload(mainImagePath, newListingMainImage);

      if (mainImageUploadError) {
        throw mainImageUploadError;
      }

      // Get the public URL of the main image
      const { data: mainImageUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(mainImagePath);

      const mainImageUrl = mainImageUrlData.publicUrl;

      // Upload additional images
      const additionalImageUrls: string[] = [];
      for (let i = 0; i < newListingAdditionalImages.length; i++) {
        const image = newListingAdditionalImages[i];
        const imagePath = `properties/${Date.now()}_${image.name}`;
        const { error: imageUploadError } = await supabase.storage
          .from('images')
          .upload(imagePath, image);

        if (imageUploadError) {
          throw imageUploadError;
        }

        const { data: imageUrlData } = supabase.storage
          .from('images')
          .getPublicUrl(imagePath);

        additionalImageUrls.push(imageUrlData.publicUrl);
      }

      // Insert new listing into Supabase
      const newListing = {
        propertytitle: newListingTitle,
        propertydescription: newListingDescription,
        propertyprice: parseFloat(newListingPrice),
        activelisting: true,
        mainimage: mainImageUrl,
        additionalimages: additionalImageUrls,
        category: [selectedCategory],
      };

      const { data: insertData, error: insertError } = await supabase
        .from('properties')
        .insert([newListing])
        .select('*');

      if (insertError) {
        throw insertError;
      }

      // Pass the new listing back to the parent component
      onAdd(insertData[0] as iListings);
      toast.success('Successfully added new listing');
      onClose();
    } catch (error) {
      console.error('Error adding new listing:', error);
      toast.error('Error adding new listing');
    }
  };
  console.log(handleAddListing);
  

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
        <DialogContent className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] md:w-[500px] max-h-[90vh] bg-gradient-to-tr from-[#010102] to-[#1e293b] rounded-lg shadow-lg border-slate-700 overflow-hidden">
          <div className="overflow-y-auto max-h-[85vh] p-6 no-scrollbar">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold mb-2 text-slate-400 activeFont tracking-normal">
                Add New Listing
              </DialogTitle>
            </DialogHeader>
            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 activeFont">
                  Property Title
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded bg-white text-black"
                  value={newListingTitle}
                  onChange={(e) => setNewListingTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 activeFont">
                  Property Description
                </label>
                <textarea
                  className="mt-1 block w-full p-2 border border-gray-300 rounded bg-white text-black"
                  value={newListingDescription}
                  onChange={(e) => setNewListingDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 activeFont">
                  Property Price
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded bg-white text-black"
                  value={newListingPrice}
                  onChange={(e) => setNewListingPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 activeFont">
                  Main Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 block w-full p-1 border border-gray-700 rounded text-gray-300 activeFont pl-[2em] bg-gray-800"
                  onChange={(e) =>
                    setNewListingMainImage(e.target.files ? e.target.files[0] : null)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 activeFont">
                  Additional Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="mt-1 block w-full p-1 border border-gray-700 rounded text-gray-300 activeFont pl-[2em] bg-gray-800"
                  onChange={(e) =>
                    setNewListingAdditionalImages(
                      e.target.files ? Array.from(e.target.files) : []
                    )
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 activeFont">
                  Category
                </label>
                <Select
                  onValueChange={(value) => setSelectedCategory(value)}
                  value={selectedCategory}
                >
                  <SelectTrigger className="mt-1 w-full bg-white text-black border border-gray-300 rounded">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    <SelectGroup>
                      {categories.map((category) => (
                        <SelectItem
                          key={category}
                          value={category}
                          className="customSelect"
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-2">
              <button
                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-800"
                onClick={handleAddListingDemo}
              >
                Save
              </button>
              <DialogClose asChild>
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default AddListingDialog;
