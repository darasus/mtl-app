import { useQuery } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { useFetcher } from "../useFetcher";

export const useCommentsQuery = ({
  postId,
  take,
}: {
  postId: number;
  take: number;
}) => {
  const fetcher = useFetcher();

  return useQuery(
    clientCacheKey.createPostCommentsKey(postId),
    () => fetcher.getComments({ postId, take }),
    {
      enabled: !!postId,
      keepPreviousData: true,
      staleTime: 1000 * 60 * 60,
    }
  );
};
