import { useSession } from "next-auth/client";
import { useQuery } from "react-query";
import { fetchMe } from "../../request/fetchMe";

export const useMeQuery = () => {
  const [session] = useSession();

  return useQuery("me", fetchMe, {
    staleTime: 1000 * 60 * 5,
    enabled: !!session,
  });
};
