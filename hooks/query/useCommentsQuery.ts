import { useQuery } from "react-query";
import { fetchComments } from "../../request/fetchComments";

export const commentsKey = {
  base: ["comments"],
  postComments: (postId: number) => [...commentsKey.base, { postId }],
  postCommentsWithTake: (postId: number, take?: number) => [
    ...commentsKey.postComments(postId),
    { take },
  ],
} as const;

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
    commentsKey.postCommentsWithTake(postId, take),
    () => fetchComments({ postId, take }).then((res) => res),
    {
      enabled: !!postId && innerEnabled,
      keepPreviousData: true,
    }
  );
};
