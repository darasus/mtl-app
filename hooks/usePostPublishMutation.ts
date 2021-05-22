import axios from "axios";
import { useMutation } from "react-query";

export const usePostPublishMutation = (id: number) => {
  return useMutation(() =>
    axios(`/api/publishPost/${id}`, {
      method: "PUT",
    })
  );
};
