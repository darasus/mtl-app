import axios from "axios";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { Post } from "../types/Post";
import { usePostCreateMutation } from "./usePostCreateMutation";
import { usePostSaveMutation } from "./usePostSaveMutation";

interface Data {
  title: string;
  description: string;
  content: string;
}

export const usePostCreate = () => {
  const createPostMutation = usePostCreateMutation();

  const createPost = React.useCallback((data: Data) => {
    return createPostMutation.mutateAsync(data);
  }, []);

  return { createPost, isLoading: createPostMutation.isLoading };
};
