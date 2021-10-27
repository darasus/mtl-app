import { Session } from "next-auth";
import { useSession } from "next-auth/client";
import { User } from "../types/User";

type Me = { me: (User & Session) | null; isLoading: boolean };

export const useMe = (): Me => {
  const [I, isLoading] = useSession();
  const me = I as (User & Session) | null;

  return { me, isLoading };
};
