import { useQuery } from "react-query";
import { Fetcher } from "../../lib/Fetcher";

export const commentsKey = {
  base: ["comments"],
  postComments: (postId: number) => [...commentsKey.base, { postId }],
} as const;

export const useCommentsQuery = ({
  postId,
  take,
}: {
  postId: number;
  take: number;
}) => {
  const fetcher = new Fetcher();

  return useQuery(
    commentsKey.postComments(postId),
    () => fetcher.getComments({ postId, take }),
    {
      enabled: !!postId,
      keepPreviousData: true,
      staleTime: 1000 * 60 * 60,
    }
  );
};
