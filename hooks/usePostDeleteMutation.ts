import axios from "axios";
import { useMutation } from "react-query";

export const usePostDeleteMutation = (id: number) => {
  return useMutation(() =>
    axios(`/api/deletePost/${id}`, {
      method: "PUT",
    })
  );
};
