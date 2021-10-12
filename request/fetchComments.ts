import qs from "query-string";
import { request } from "../lib/request";
import { CommentService } from "../services/api/CommentService";

type Response = ReturnType<CommentService["getCommentsByPostId"]>;

export const fetchComments = ({
  postId,
  take,
  cursor,
}: {
  postId: number;
  take?: number;
  cursor?: number;
}): Promise<Response> => {
  const query = qs.stringify({ take, cursor });

  return request(`/api/post/${postId}/comments?${query}`).then(
    (res) => res.data
  );
};
