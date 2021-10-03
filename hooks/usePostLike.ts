import React from "react";
import { usePostLikeMutation } from "./mutation/usePostLikeMutation";

export const usePostLike = () => {
  const likePostMutation = usePostLikeMutation();

  const likePost = React.useCallback((postId: number) => {
    return likePostMutation.mutateAsync({ postId });
  }, []);

  return { likePost, isLoading: likePostMutation.isLoading };
};
