import React from "react";
import { supabase } from "../lib/supabase";
import { Session, User } from "@supabase/gotrue-js";

export const UserContext = React.createContext<{
  session: Session | null;
  user: User | null;
  userLoaded: boolean;
  signOut: () => Promise<any>;
}>({
  session: null,
  user: null,
  userLoaded: false,
  signOut: () => Promise.resolve(),
});

export const UserContextProvider: React.FC = ({ children }) => {
  const [userLoaded, setUserLoaded] = React.useState(false);
  const [session, setSession] = React.useState<Session | null>(null);
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const session = supabase.auth.session();
    setSession(session);
    setUser(session?.user ?? null);
    setUserLoaded(!!session?.user);
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setUserLoaded(!!session?.user);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const signOut = () => {
    return supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    userLoaded,
    signOut,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useMe = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }
  return context;
};
