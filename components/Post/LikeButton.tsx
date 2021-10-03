import { Button, Text } from "@chakra-ui/react";
import React from "react";
import { usePostLike } from "../../hooks/usePostLike";
import { Post } from "../../types/Post";
import { ThumbUpIcon } from "@heroicons/react/outline";
import { usePostUnlike } from "../../hooks/usePostUnlike";

interface Props {
  post: Post;
}

export const LikeButton: React.FC<Props> = ({ post }) => {
  const { likePost, isLoading: likeIsLoading } = usePostLike();
  const { unlikePost, isLoading: unlikeIsLoading } = usePostUnlike();
  const handleLikeClick = React.useCallback(() => likePost(post.id), []);
  const handleUnlikeClick = React.useCallback(() => unlikePost(post.id), []);

  return (
    <Button
      leftIcon={<ThumbUpIcon width="20" height="20" />}
      onClick={post.isLikedByMe ? handleUnlikeClick : handleLikeClick}
      disabled={likeIsLoading || unlikeIsLoading}
      size="sm"
      variant="ghost"
    >
      <Text>{`${post.isLikedByMe ? "Unlike" : "Like"}`}</Text>
    </Button>
  );
};
