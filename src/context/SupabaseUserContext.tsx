import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import type { User } from "@supabase/supabase-js";

interface SupabaseUserContextType {
  user: User | null;
}

const SupabaseUserContext = createContext<SupabaseUserContextType>({
  user: null,
});

export const SupabaseUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for an existing user session
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    fetchUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <SupabaseUserContext.Provider value={{ user }}>
      {children}
    </SupabaseUserContext.Provider>
  );
};

export const useSupabaseUser = (): SupabaseUserContextType => {
  const context = useContext(SupabaseUserContext);
  if (!context) {
    throw new Error("useSupabaseUser must be used within a SupabaseUserProvider");
  }
  return context;
};
