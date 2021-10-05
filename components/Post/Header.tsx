import { Box, Flex, Text } from "@chakra-ui/react";
import { Post as PostType } from "../../types/Post";
import { ThumbUpIcon, ChatIcon } from "@heroicons/react/outline";
import React from "react";
import { PostUserPreview } from "../PostUserPreview";
import { RouterLink } from "../RouterLinkt";
import { useColors } from "../../hooks/useColors";

interface Props {
  post: PostType;
}

export const Header: React.FC<Props> = ({ post }) => {
  const { secondaryTextColor } = useColors();

  return (
    <Box p={4}>
      <Flex alignItems="center">
        <Box mr={2}>
          <RouterLink href={`/p/${post.id}`}>
            <Text fontSize="sm" data-testid="post-title">
              {post.title}
            </Text>
          </RouterLink>
        </Box>
        <Box mr={2}>
          <Text fontSize="sm">by</Text>
        </Box>
        <Box mr={2}>
          {post.author && <PostUserPreview user={post.author} />}
        </Box>
        <Box mr={2}>
          <Flex color={secondaryTextColor}>
            <Flex mr={2} alignItems="center">
              <Box mr={1}>
                <ThumbUpIcon width="15" height="15" />
              </Box>
              <Box>
                <Text fontSize="sm">{`${post.likesCount} likes`}</Text>
              </Box>
            </Flex>
            <Flex alignItems="center">
              <Box mr={1}>
                <ChatIcon width="15" height="15" />
              </Box>
              <Box>
                <Text fontSize="sm">{`${post.commentsCount} comments`}</Text>
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};