import { Activity } from ".prisma/client";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { MenuItem } from "@chakra-ui/menu";
import { useRouter } from "next/router";
import React from "react";
import { useMarkActivityAsReadMutation } from "../../hooks/mutation/useMarkActivityAsReadMutation";

export const Notification = ({ activity }: { activity: Activity & any }) => {
  const router = useRouter();
  const message = composeActivityMessage(activity);
  const mutation = useMarkActivityAsReadMutation(activity.id);

  const onClick = () => {
    mutation.mutate();
    router.push(`/p/${activity.postId}`);
  };

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

// TODO: fix any
const composeActivityMessage = (activity: Activity & any) => {
  if (typeof activity.likeId === "number") {
    return `${activity.author.name} liked your post ${activity.post.title}`;
  }
  if (typeof activity.commentId === "number") {
    return `${activity.author.name} commented on your post ${activity.post.title}`;
  }
  return null;
};
