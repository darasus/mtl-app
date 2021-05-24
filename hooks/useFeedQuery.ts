import { useQuery } from "react-query";
import { fetchFeed } from "../request/fetchFeed";

export const useFeedQuery = () => {
  return useQuery("feed", fetchFeed);
};
