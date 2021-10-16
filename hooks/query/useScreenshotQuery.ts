import { useQuery } from "react-query";
import { Fetcher } from "../../lib/Fetcher";

export const createUseScreenshotQueryCacheKey = (url: string) => [
  "screehshot",
  url,
];

export const useScreenshotQuery = (url: string) => {
  const fetcher = new Fetcher();

  return useQuery(
    createUseScreenshotQueryCacheKey(url),
    () => fetcher.getScreenshot({ url }),
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );
};
