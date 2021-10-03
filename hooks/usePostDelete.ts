import React from "react";
import { usePostDeleteMutation } from "./mutation/usePostDeleteMutation";

export const usePostDelete = (id: number) => {
  const deletePostMutation = usePostDeleteMutation(id);

  const deletePost = React.useCallback(() => {
    return deletePostMutation.mutate();
  }, []);

  return { deletePost, isLoading: deletePostMutation.isLoading };
};
