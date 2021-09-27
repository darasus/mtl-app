import { Comment } from "@prisma/client";
import axios from "axios";
import { Post } from "../types/Post";

export const fetchComments = ({
  postId,
  take,
}: {
  postId: number;
  take?: number;
}): Promise<Post["comments"]> =>
  axios(`/api/post/${postId}/comments${take ? `?take=${take}` : ""}`).then(
    (res) => res.data
  );
