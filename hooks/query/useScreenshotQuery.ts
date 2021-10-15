import { useQuery } from "react-query";
import { Fetcher } from "../../lib/Fetcher";

export const createUseScreenshotQueryCacheKey = (postId: number) => [
  "screehshot",
  postId,
];

export const useScreenshotQuery = (postId: number) => {
  const fetcher = new Fetcher();

  return useQuery(
    createUseScreenshotQueryCacheKey(postId),
    () => fetcher.getScreenshot(postId),
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );
};
