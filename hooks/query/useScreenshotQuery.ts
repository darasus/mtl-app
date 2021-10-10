import { useQuery } from "react-query";
import { fetchScreenshot } from "../../request/fetchScreenshot";

export const createUseScreenshotQueryCacheKey = (postId: number) => [
  "screehshot",
  postId,
];

export const useScreenshotQuery = (postId: number) => {
  return useQuery(
    createUseScreenshotQueryCacheKey(postId),
    () => fetchScreenshot(postId),
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );
};
