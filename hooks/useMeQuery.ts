import { useQuery } from "react-query";
import { fetchMe } from "../request/fetchMe";

export const useMeQuery = () => {
  return useQuery("me", fetchMe, {
    staleTime: 1000 * 60 * 5,
  });
};
