import { Button, Text } from "@chakra-ui/react";
import React from "react";
import { usePostLike } from "../../hooks/usePostLike";
import { Post } from "../../types/Post";
import { ThumbUpIcon } from "@heroicons/react/outline";

interface Props {
  post: Post;
}

export const LikeButton: React.FC<Props> = ({ post }) => {
  const { likePost, isLoading } = usePostLike();
  const handleLikeClick = () => likePost(post.id);

  return (
    <Button
      leftIcon={<ThumbUpIcon width="20" height="20" />}
      onClick={handleLikeClick}
      disabled={isLoading || post.isLikedByMe}
      size="sm"
      variant="ghost"
    >
      <Text>{`${post.isLikedByMe ? "Liked!" : "Like"}${
        post.likes > 0 ? ` (${post.likes})` : ""
      }`}</Text>
    </Button>
  );
};