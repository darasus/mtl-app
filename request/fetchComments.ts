import axios from "axios";
import qs from "query-string";
import { CommentService } from "../services/api/CommentService";

type Response = ReturnType<CommentService["getCommentsByPostId"]>;

export const fetchComments = ({
  postId,
  take,
  skip,
}: {
  postId: number;
  take?: number;
  skip?: number;
}): Promise<Response> => {
  const query = qs.stringify({ take, skip });

  return axios(`/api/post/${postId}/comments?${query}`).then((res) => res.data);
};
