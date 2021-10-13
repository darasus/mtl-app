import { Button, Text } from "@chakra-ui/react";
import React from "react";
import { usePostLikeMutation } from "../../hooks/mutation/usePostLikeMutation";
import { Post } from "../../types/Post";
import { ThumbUpIcon } from "@heroicons/react/outline";
import { usePostUnlikeMutation } from "../../hooks/mutation/usePostUnlikeMutation";

interface Props {
  post: Post;
  isPostLoading?: boolean;
}

export const LikeButton: React.FC<Props> = ({ post, isPostLoading }) => {
  const { mutate: likePost, isLoading: likeIsLoading } = usePostLikeMutation();
  const { mutate: unlikePost, isLoading: unlikeIsLoading } =
    usePostUnlikeMutation();
  const handleLikeClick = React.useCallback(
    () => likePost({ postId: post.id }),
    [post.id, likePost]
  );
  const handleUnlikeClick = React.useCallback(
    () => unlikePost({ postId: post.id }),
    [post.id, unlikePost]
  );
  const text = `${post.isLikedByMe ? "Unlike" : "Like"}`;

  return (
    <Button
      leftIcon={<ThumbUpIcon width="15" height="15" />}
      onClick={post.isLikedByMe ? handleUnlikeClick : handleLikeClick}
      disabled={likeIsLoading || unlikeIsLoading || isPostLoading}
      isLoading={likeIsLoading || unlikeIsLoading || isPostLoading}
      loadingText={text}
      size="xs"
      variant="ghost"
    >
      <Text>{text}</Text>
    </Button>
  );
};
