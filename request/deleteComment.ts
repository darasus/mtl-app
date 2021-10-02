import axios from "axios";

export const deleteComment = (commentId: number): Promise<void> =>
  axios(`/api/comment/${commentId}`, {
    method: "DELETE",
  }).then((res) => res.data);
