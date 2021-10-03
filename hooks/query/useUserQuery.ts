import { useQuery } from "react-query";
import { fetchUser } from "../../request/fetchUser";

export const useUserQuery = (id: number) => {
  return useQuery(["user", id], () => fetchUser(id), {
    staleTime: 1000 * 60 * 5,
  });
};
