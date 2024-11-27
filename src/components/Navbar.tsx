import { HiMenu } from "react-icons/hi";
import Obsidian from "../assets/ObsidianCropped.png";
import { NavbarProps } from "../models/NavbarProps";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../../components/ui/sheet";
import { toast } from "sonner";

export const Navbar = ({ isSidebarOpen, setIsSidebarOpen }: NavbarProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userImage, setUserImage] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [originalFirstName, setOriginalFirstName] = useState<string>('');
  const [originalLastName, setOriginalLastName] = useState<string>('');
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user from Supabase', error);
        return;
      }
      if (user) {
        setUser(user);
        const { data, error } = await supabase
          .from('users')
          .select('userimage, firstname, surname')
          .eq('id', user.id)
          .single();
        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          // Append timestamp to userimage for cache related issues when updating profil image
          const timestamp = new Date().getTime();
          const userImageWithTimestamp = data.userimage
            ? `${data.userimage}?t=${timestamp}`
            : '';

          setUserImage(userImageWithTimestamp);
          setFirstName(data.firstname || '');
          setLastName(data.surname || '');
          setOriginalFirstName(data.firstname || '');
          setOriginalLastName(data.surname || '');
        }
      }
    };
    fetchUserData();
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Error uploading image to bucket', uploadError);
        toast.error('Error uploading image');
      } else {
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        const publicUrl = publicUrlData.publicUrl;

        // Append timestamp to publicUrl
        const timestamp = new Date().getTime();
        const publicUrlWithTimestamp = `${publicUrl}?t=${timestamp}`;

        const { error: updateError } = await supabase
          .from('users')
          .update({ userimage: publicUrl })
          .eq('id', user.id);

        if (updateError) {
          console.error('Error updating user image:', updateError);
          toast.error('Error updating profile image');
        } else {
          setUserImage(publicUrlWithTimestamp);
          toast.success('Profile image updated');
        }
      }
    }
  };

  const handleSave = async () => {
    if (user) {
      const { error } = await supabase
        .from('users')
        .update({ firstname: firstName, surname: lastName })
        .eq('id', user.id);
      if (error) {
        console.error('Error updating user name:', error);
        toast.error('Error updating user name');
      } else {
        toast.success('User name updated');
        setOriginalFirstName(firstName);
        setOriginalLastName(lastName);
        setIsSheetOpen(false);
      }
    }
  };

  const handleCancel = () => {
    setIsSheetOpen(false);
  };

  return (
    <>
      {/* Top Navbar */}
      <div className="bg-gradient-to-tr from-[#010102] to-[#1e293b] border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white p-2 hover:bg-gray-700 rounded-md"
          >
            <HiMenu size={24} />
          </button>
          <img
            src={Obsidian}
            alt="Obsidian Logo"
            className="lg:h-6 h-5 ml-3"
          />
        </div>

        {/* Avatar and Sheet */}
        <div>
          <Sheet open={isSheetOpen} onOpenChange={(open) => setIsSheetOpen(open)}>
            <SheetTrigger asChild>
              <button
                onClick={() => {
                  setIsSheetOpen(true);
                  setFirstName(originalFirstName);
                  setLastName(originalLastName);
                }}
              >
                <div className="flex flex-row items-center gap-3">
                  <p className="text-md lg:text-[17px] text-white activeFont font-semibold">{firstName}</p>

                  <Avatar className="cursor-pointer mr-6">
                    {userImage ? (
                      <AvatarImage src={userImage} alt="User Image" />
                    ) : (
                      <AvatarFallback className="text-white">
                        {user && user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-gradient-to-tr from-[#010102] to-[#1e293b] border-slate-800"
            >
              <SheetHeader>
                <SheetTitle className="text-slate-200 activeFont">User Settings</SheetTitle>
              </SheetHeader>
              {/* User Settings Content */}
              <div className="mt-4 flex flex-col items-center">
                {/* Avatar Image */}
                <Avatar className="w-24 h-24">
                  {userImage ? (
                    <AvatarImage src={userImage} alt="User Image" />
                  ) : (
                    <AvatarFallback className="text-white text-4xl bg-slate-700">
                      {user && user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
                {/* Upload New Profile Image */}
                <label className="block text-sm font-medium text-slate-200 mt-4 activeFont">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-7 block w-full text-slate-200 border border-slate-700"
                  onChange={handleImageUpload}
                />
                {/* First Name Input */}
                <div className="mt-6 w-full">
                  <label className="block text-sm font-medium text-slate-200 activeFont">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                {/* Last Name Input */}
                <div className="mt-4 w-full">
                  <label className="block text-sm font-medium text-slate-200 activeFont">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-2 w-full">
                  <button
                    className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-800"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

export default Navbar;
