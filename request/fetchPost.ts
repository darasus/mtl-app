import axios from "axios";
import { Post } from "../types/Post";

export const fetchPost = (id: number): Promise<Post> =>
  axios(`/api/post/${id}`).then((res) => res.data);
