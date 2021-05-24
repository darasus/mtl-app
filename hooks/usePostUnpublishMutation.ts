import axios from "axios";
import { useMutation } from "react-query";

export const usePostUnpublishMutation = (id: number) => {
  return useMutation(() =>
    axios(`/api/post/${id}/unpublish`, {
      method: "PUT",
    })
  );
};
