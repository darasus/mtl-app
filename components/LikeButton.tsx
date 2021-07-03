import { ActionButton, Text } from "@adobe/react-spectrum";
import ThumbUpOutline from "@spectrum-icons/workflow/ThumbUpOutline";
import React from "react";
import { usePostLike } from "../hooks/usePostLike";
import { Post } from "../types/Post";

interface Props {
  post: Post;
}

export const LikeButton: React.FC<Props> = ({ post }) => {
  const { likePost, isLoading } = usePostLike();
  const handleLikeClick = () => likePost(post.id);

  return (
    <ActionButton
      isQuiet
      onPress={handleLikeClick}
      isDisabled={isLoading || post.isLikedByMe}
    >
      <ThumbUpOutline />
      {post.isLikedByMe ? <Text>Liked!</Text> : <Text>Like</Text>}
    </ActionButton>
  );
};
