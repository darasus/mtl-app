import { useMutation } from "react-query";
import { followUser } from "../request/followUser";

export const useFollowMutation = () => {
  return useMutation<unknown, unknown, { userId: number }>(({ userId }) =>
    followUser(userId).then((res) => res.data)
  );
};
