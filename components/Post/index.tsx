import React from "react";
import { Markdown } from "../Markdown";
import { Flex, Box, Text, Button } from "@chakra-ui/react";
import useCopyClipboard from "../../hooks/useClipboard";
import { Syntax } from "../Syntax";
import { LikeButton } from "./LikeButton";
import { Comments } from "./Comments";
import { ShareIcon, DocumentDuplicateIcon } from "@heroicons/react/outline";
import { useColors } from "../../hooks/useColors";
import { ActionMenu } from "./ActionMenu";
import { paramCase } from "change-case";
import { Header } from "./Header";
import { ScreenshotButton } from "./ScreenshotButton";
import { usePostQuery } from "../../hooks/query/usePostQuery";

interface Props {
  postId: number;
  isMyPost: boolean;
  showActionMenu?: boolean;
  showMetaInfo?: boolean;
  isPostLoading?: boolean;
}

export const Post: React.FC<Props> = React.memo(function Post({
  postId,
  isMyPost,
  showActionMenu = true,
  showMetaInfo = true,
}) {
  const { data: post } = usePostQuery(postId);
  const { borderColor } = useColors();

  const [isCopied, copy] = useCopyClipboard(post?.content || "", {
    successDuration: 3000,
  });

  const handleClipboardCopy = React.useCallback(() => copy(), [copy]);

  const handleTweetClick = React.useCallback(() => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURI(
        `Check this: ${window.location.origin}/api/post/${post?.id}/screenshot`
      )}`
    );
  }, []);

  if (!post) return null;

  return (
    <Box borderColor={borderColor} borderWidth="thin">
      <Flex flexDirection="column">
        <Box>
          <Box borderColor={borderColor} borderBottomWidth="thin">
            <Header post={post} showMetaInfo={showMetaInfo} />
          </Box>
          <Box p={4} borderColor={borderColor} borderBottomWidth="thin">
            <Flex flexDirection="column">
              <Markdown value={post.description || ""} />
            </Flex>
          </Box>
          <Syntax value={post.content || ""} />
        </Box>
        {showActionMenu && (
          <>
            <Box borderColor={borderColor} borderTopWidth="thin">
              <Flex alignItems="center" p={4}>
                <Box mr="2">
                  <LikeButton post={post} />
                </Box>
                <Button
                  leftIcon={<ShareIcon width="15" height="15" />}
                  onClick={handleTweetClick}
                  variant="ghost"
                  size="xs"
                  mr={2}
                >
                  <Text>Tweet</Text>
                </Button>
                <Button
                  leftIcon={<DocumentDuplicateIcon width="15" height="15" />}
                  onClick={handleClipboardCopy}
                  disabled={isCopied}
                  variant="ghost"
                  size="xs"
                  mr={2}
                >
                  <Text>{isCopied ? "Copied!" : "Copy"}</Text>
                </Button>
                <ScreenshotButton title={post.title} postId={post.id} />
                <Box flexGrow={1} />
                <ActionMenu isMyPost={isMyPost} post={post} />
              </Flex>
            </Box>
            <Box>
              <Comments postId={post.id} />
            </Box>
          </>
        )}
      </Flex>
    </Box>
  );
});
