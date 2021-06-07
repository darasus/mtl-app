import axios from "axios";
import { Post } from "../types/Post";

export const fetchUserPosts = (id: number): Promise<Post[]> =>
  axios(`${process.env.BASE_URL}/api/user/${id}/posts`).then((res) => res.data);
