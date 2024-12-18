import '../styles/listingdialog.css'
import { useState, useEffect } from 'react';
import '../styles/listingdialog.css';
import '../styles/editlisting.css'
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
import { iListings } from '../models/iListings';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { toast } from 'sonner';
import { EditListingDialogProps } from '../models/EditListingDialogProps';

const EditListingDialog = ({ listing, onClose, onSave }: EditListingDialogProps) => {
  const [currentListing, setCurrentListing] = useState<iListings>(listing);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    currentListing.category[0] || ''
  );

  useEffect(() => {
    // Fetching my categories from Supabase
    setCategories(['villas', 'spain', 'apartments']);
  }, []);

  useEffect(() => {
    setCurrentListing((prev) => ({
      ...prev,
      category: [selectedCategory],
    }));
  }, [selectedCategory]);

  const handlePrevImage = () => {
    const totalImages = [currentListing.mainimage, ...currentListing.additionalimages].length;
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const handleNextImage = () => {
    const totalImages = [currentListing.mainimage, ...currentListing.additionalimages].length;
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
  };

  const handleInputChange = (
    field: keyof Pick<iListings, 'propertytitle' | 'propertydescription' | 'propertyprice'>,
    value: string
  ) => {
    setCurrentListing((prev) => ({
      ...prev,
      [field]: field === 'propertyprice' ? Number(value) || 0 : value,
    }));
  };

  const saveEditedProperty = async () => {
    try {
      const updatedData = {
        propertytitle: currentListing.propertytitle,
        propertydescription: currentListing.propertydescription,
        propertyprice: Number(currentListing.propertyprice),
        category: [selectedCategory],
      };

      const { error } = await supabase
        .from('properties')
        .update(updatedData)
        .eq('id', currentListing.id);

      if (error) throw error;

      toast.success('Successfully edited listing');
      onSave(currentListing);
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Error updating property');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
        <DialogContent className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] md:w-[500px] max-h-[90vh] bg-gradient-to-tr from-[#010102] to-[#1e293b] rounded-lg shadow-lg border-slate-700 overflow-hidden">
          <div className="overflow-y-auto max-h-[85vh] p-6 no-scrollbar">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold mb-2 text-slate-400 activeFont tracking-normal">
                Edit Property
              </DialogTitle>
            </DialogHeader>
            {/* Image Slideshow Section */}
            <div className="relative w-full h-[300px] bg-black/20 mb-4">
              <img
                src={[currentListing.mainimage, ...currentListing.additionalimages][currentImageIndex]}
                alt={`Property image ${currentImageIndex + 1}`}
                className="w-full h-[300px] rounded object-cover"
              />

              {/* Navigation Chevrons */}
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
              >
                <ChevronRight size={24} />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 rounded text-white text-sm">
                {currentImageIndex + 1} / {[currentListing.mainimage, ...currentListing.additionalimages].length}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 activeFont">
                  Property Title
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded bg-white text-black"
                  value={currentListing.propertytitle}
                  onChange={(e) => handleInputChange('propertytitle', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 activeFont">
                  Property Description
                </label>
                <textarea
                  className="mt-1 block w-full p-2 border border-gray-300 rounded bg-white text-black"
                  value={currentListing.propertydescription}
                  onChange={(e) => handleInputChange('propertydescription', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 activeFont">
                  Property Price
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded bg-white text-black"
                  value={currentListing.propertyprice}
                  onChange={(e) => handleInputChange('propertyprice', e.target.value)}
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
                onClick={saveEditedProperty}
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

export default EditListingDialog;
