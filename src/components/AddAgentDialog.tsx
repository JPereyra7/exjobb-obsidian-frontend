import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
  DialogClose,
} from '../../components/ui/dialog';
import { supabase } from '../supabaseClient';
import { iAgent } from '../models/iAgent';
import { toast } from 'sonner';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '../../components/ui/avatar';

interface AddAgentDialogProps {
  onClose: () => void;
  onAdd: (newAgent: iAgent) => void;
}

const AddAgentDialog = ({ onClose, onAdd }: AddAgentDialogProps) => {
  const [firstname, setFirstname] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [agentImage, setAgentImage] = useState<string>('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setAgentImage(imageUrl);
    }
  };

  const addAgent = async () => {
    try {
      if (!firstname || !surname || !email || !imageFile) {
        toast.warning('Please fill out all fields and select an image.');
        return;
      }

      // Upload agent image to Supabase storage
      const filename = `${Date.now()}_${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('agents')
        .upload(filename, imageFile);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL of the image
      const { data } = supabase.storage.from('agents').getPublicUrl(filename);
      const imageUrl = data.publicUrl;

      // Insert new agent into Supabase
      const { data: insertData, error: insertError } = await supabase
        .from('agents')
        .insert({
          firstname,
          surname,
          email,
          agentimage: imageUrl,
        })
        .select('*');

      if (insertError) {
        throw insertError;
      }
      onAdd(insertData[0] as iAgent);
      toast.success('Successfully added new agent');
      onClose();
    } catch (error) {
      console.error('Error adding agent:', error);
      toast.error('Error adding agent');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
        <DialogContent className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] md:w-[500px] max-h-[90vh] bg-gradient-to-tr from-[#010102] to-[#1e293b] rounded-lg shadow-lg border border-gray-700 overflow-hidden">
          <div className="overflow-y-auto max-h-[85vh] p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold mb-4 text-slate-400 activeFont tracking-normal">
                Add New Agent
              </DialogTitle>
            </DialogHeader>
            {/* Agent Image and Upload */}
            <div className="mt-4 flex flex-col items-center">
              <Avatar className="w-24 h-24">
                {agentImage ? (
                  <AvatarImage src={agentImage} alt="Agent Image" />
                ) : (
                  <AvatarFallback className="text-white text-xl bg-slate-700">
                    📷
                  </AvatarFallback>
                )}
              </Avatar>
              {/* Upload Agent Image */}
              <label className="block text-sm font-medium text-slate-200 mt-4 activeFont">
                Agent Image
              </label>
              <input
                type="file"
                accept="image/*"
                className="mt-2 block w-full text-slate-200 border border-slate-700"
                onChange={handleImageUpload}
              />
            </div>
            {/* Form Fields */}
            <div className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 activeFont">
                  First Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 activeFont">
                  Surname
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 activeFont">
                  Email
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-2">
              <button
                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-800"
                onClick={addAgent}
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

export default AddAgentDialog;
