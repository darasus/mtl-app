import { useSession } from "next-auth/client";
import { MeSession } from "../types/MeSession";

export const useMe = (): {
  me: MeSession | null;
  isLoading: boolean;
} => {
  const [I, isLoading] = useSession();
  const me = I as MeSession | null;

  return { me, isLoading };
};
