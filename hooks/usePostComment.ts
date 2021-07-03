import React from "react";
import { usePostCommentMutation } from "./usePostCommentMutation";
import { usePostLikeMutation } from "./usePostLikeMutation";

export const usePostComment = () => {
  const commentPostMutation = usePostCommentMutation();

  const commentPost = React.useCallback((postId: number, content: string) => {
    return commentPostMutation.mutateAsync({ postId, content });
  }, []);

  return { commentPost, isLoading: commentPostMutation.isLoading };
};
