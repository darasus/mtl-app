import { useQuery } from "react-query";
import { fetchComments } from "../../request/fetchComments";

export const createUseCommentsQueryCacheKey = (
  postId: number,
  take: number | undefined = 3
) => ["comments", postId, take];

export const useCommentsQuery = ({
  postId,
  enabled,
  take,
}: {
  postId: number;
  enabled: boolean;
  take?: number;
}) => {
  const innerEnabled = typeof enabled === "boolean" ? enabled : true;

  return useQuery(
    createUseCommentsQueryCacheKey(postId, take),
    () => fetchComments({ postId, take }).then((res) => res),
    {
      enabled: !!postId && innerEnabled,
      keepPreviousData: true,
    }
  );
};
