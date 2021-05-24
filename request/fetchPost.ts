import axios from "axios";
import { Post } from "../types/Post";

export const fetchPost = (id: number): Promise<Post> =>
  axios(`${process.env.BASE_URL}/api/post/${id}`).then((res) => res.data);
