import { request } from "../lib/request";

export const deleteComment = (commentId: number): Promise<void> =>
  request(`/api/comment/${commentId}`, {
    method: "DELETE",
  }).then((res) => res.data);
