import axios from "axios";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { Post } from "../types/Post";
import { usePostSaveMutation } from "./usePostSaveMutation";

interface Data {
  title: string;
  description: string;
  content: string;
}

export const usePostSave = () => {
  const savePostMutation = usePostSaveMutation();

  const savePost = React.useCallback((data: Data) => {
    return savePostMutation.mutateAsync(data);
  }, []);

  return { savePost, isLoading: savePostMutation.isLoading };
};
