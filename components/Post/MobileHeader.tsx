import { Box, Flex, Text } from "@chakra-ui/react";
import { Post as PostType } from "../../types/Post";
import {
  ThumbUpIcon,
  ChatIcon,
  TagIcon,
  CodeIcon,
} from "@heroicons/react/outline";
import React from "react";
import { RouterLink } from "../RouterLinkt";
import { useColors } from "../../hooks/useColors";
import { CodeLanguage } from ".prisma/client";

interface Props {
  post: PostType;
}

const codeExtensionMap = {
  [CodeLanguage.JAVASCRIPT]: "js",
  [CodeLanguage.TYPESCRIPT]: "ts",
};

export const MobileHeader: React.FC<Props> = ({ post }) => {
  const { secondaryTextColor } = useColors();

  return (
    <Box p={4}>
      <Text fontSize="sm" noOfLines={3}>
        <RouterLink href={`/p/${post.id}`}>{post.title}</RouterLink>
      </Text>
      <Flex flexGrow={1}>
        <Box mr={2}>
          <Flex color={secondaryTextColor}>
            <Flex mr={2} alignItems="center">
              <Text fontSize="sm" color={secondaryTextColor}>
                <RouterLink href={`/u/${post.authorId}`}>
                  {post.author?.name}
                </RouterLink>
              </Text>
            </Flex>
            <Flex mr={2} alignItems="center">
              <Box mr={1}>
                <CodeIcon width="15" height="15" />
              </Box>
              <Box>
                <Text fontSize="sm">
                  {codeExtensionMap[post.codeLanguage!]}
                </Text>
              </Box>
            </Flex>
            <Flex mr={2} alignItems="center">
              <Box mr={1}>
                <ThumbUpIcon width="15" height="15" />
              </Box>
              <Box>
                <Text fontSize="sm">{post.likesCount}</Text>
              </Box>
            </Flex>
            <Flex alignItems="center" mr={2}>
              <Box mr={1}>
                <ChatIcon width="15" height="15" />
              </Box>
              <Box>
                <Text fontSize="sm">{post.commentsCount}</Text>
              </Box>
            </Flex>
            <Flex alignItems="center">
              <Box mr={1}>
                <TagIcon width="15" height="15" />
              </Box>
              <Box>
                <Text fontSize="sm">{`${post.tags
                  .map((tag) => tag.tag.name)
                  .join(",")}`}</Text>
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};
