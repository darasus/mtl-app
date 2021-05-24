import axios from "axios";
import { useMutation } from "react-query";

export const usePostDeleteMutation = () => {
  return useMutation((id: number) =>
    axios(`/api/deletePost/${id}`, {
      method: "DELETE",
    })
  );
};
