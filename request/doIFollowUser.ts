import axios from "axios";

export const doIFollowUser = (userId: number): Promise<any> =>
  axios(`/api/user/${userId}/follow`, {}).then((res) => res.data);
