import { useQuery } from "react-query";
import { fetchComments } from "../../request/fetchComments";

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
  return useQuery(
    commentsKey.postComments(postId),
    () => fetchComments({ postId, take }).then((res) => res),
    {
      enabled: !!postId,
      keepPreviousData: true,
      staleTime: 1000 * 60 * 60,
    }
  );
};
