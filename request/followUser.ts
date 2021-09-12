import axios from "axios";

export const followUser = (userId: number): Promise<any> =>
  axios(`/api/user/${userId}/follow`, {
    method: "POST",
  }).then((res) => res.data);
