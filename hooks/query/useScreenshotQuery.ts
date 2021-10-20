import { useQuery } from "react-query";
import { useFetcher } from "../useFetcher";

export const createUseScreenshotQueryCacheKey = (url: string) => [
  "screehshot",
  url,
];

export const useScreenshotQuery = (url: string) => {
  const fetcher = useFetcher();

  return useQuery(
    createUseScreenshotQueryCacheKey(url),
    () => fetcher.getScreenshot({ url }),
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );
};
