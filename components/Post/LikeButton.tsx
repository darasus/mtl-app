import { Button, Text } from "@chakra-ui/react";
import React from "react";
import { usePostLike } from "../../hooks/usePostLike";
import { Post } from "../../types/Post";
import { ThumbUpIcon } from "@heroicons/react/outline";
import { usePostUnlike } from "../../hooks/usePostUnlike";
import { useColors } from "../../hooks/useColors";

interface Props {
  post: Post;
}

export const LikeButton: React.FC<Props> = ({ post }) => {
  const { secondaryButtonTextColor } = useColors();
  const { likePost, isLoading: likeIsLoading } = usePostLike();
  const { unlikePost, isLoading: unlikeIsLoading } = usePostUnlike();
  const handleLikeClick = React.useCallback(() => likePost(post.id), []);
  const handleUnlikeClick = React.useCallback(() => unlikePost(post.id), []);

  return (
    <Button
      leftIcon={<ThumbUpIcon width="15" height="15" />}
      onClick={post.isLikedByMe ? handleUnlikeClick : handleLikeClick}
      disabled={likeIsLoading || unlikeIsLoading}
      size="xs"
      variant="ghost"
    >
      <Text>{`${post.isLikedByMe ? "Unlike" : "Like"}`}</Text>
    </Button>
  );
};
