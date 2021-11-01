import { Activity } from ".prisma/client";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { MenuItem } from "@chakra-ui/menu";
import { useRouter } from "next/router";
import React from "react";
import { useMarkActivityAsReadMutation } from "../../hooks/mutation/useMarkActivityAsReadMutation";

export const Notification = ({ activity }: { activity: Activity & any }) => {
  const router = useRouter();
  const markAsReadMutation = useMarkActivityAsReadMutation(activity.id);
  const isLikeNotification = typeof activity.likeId === "number";
  const isCommentNotification = typeof activity.commentId === "number";
  const isFollowNotification =
    typeof activity?.follow?.follower?.id === "number";

  const composeActivityMessage = React.useCallback(
    (activity: Activity & any) => {
      if (isLikeNotification) {
        return `${activity.author.name} liked your post ${activity.post.title}`;
      }

      if (isCommentNotification) {
        return `${activity.author.name} commented on your post ${activity.post.title}`;
      }

      if (isFollowNotification) {
        return `${activity?.follow?.follower?.name} followed you`;
      }

      return null;
    },
    [isLikeNotification, isCommentNotification, isFollowNotification]
  );

  const message = composeActivityMessage(activity);

  const onClick = React.useCallback(() => {
    markAsReadMutation.mutate();
    if (isLikeNotification || isCommentNotification) {
      router.push(`/p/${activity.postId}`);
    }
    if (isFollowNotification) {
      router.push(`/u/${activity?.follow?.follower?.id}`);
    }
  }, [
    markAsReadMutation,
    router,
    activity.postId,
    activity?.follow,
    isLikeNotification,
    isCommentNotification,
    isFollowNotification,
  ]);

  return (
    <MenuItem onClick={onClick} key={activity.id}>
      <Flex alignItems="center" width="100%">
        <Box flexGrow={1} maxWidth="100%" overflow="hidden">
          <Text noOfLines={2} size="sm">
            {message}
          </Text>
        </Box>
        <Box ml={2} minWidth={3}>
          {activity.unread && (
            <Box width={2} height={2} borderRadius="full" bg="blue.500" />
          )}
        </Box>
      </Flex>
    </MenuItem>
  );
};
