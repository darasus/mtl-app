import { request } from "../lib/request";

export const fetchScreenshot = (postId: number) =>
  request(`/api/post/${postId}/screenshot`, { responseType: "blob" }).then(
    (res) => res.data
  );
