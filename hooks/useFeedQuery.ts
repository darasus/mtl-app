import { useQuery } from "react-query";
import { fetchFeed } from "../request/fetchFeed";

export const createUseFeedQueryCacheKey = () => "feed";

export const useFeedQuery = () => {
  return useQuery(createUseFeedQueryCacheKey(), fetchFeed);
};
