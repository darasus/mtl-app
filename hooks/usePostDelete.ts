import React from "react";
import { usePostDeleteMutation } from "./usePostDeleteMutation";

export const usePostDelete = () => {
  const deletePostMutation = usePostDeleteMutation();

  const deletePost = React.useCallback((id: number) => {
    return deletePostMutation.mutate(id);
  }, []);

  return { deletePost, isLoading: deletePostMutation.isLoading };
};
