import React from "react";
import { UserPreview } from "./UserPreview";
import { Markdown } from "./Markdown";
import { Flex, Box, Text, Button } from "@chakra-ui/react";
import { RouterLink } from "./RouterLinkt";
import useCopyClipboard from "../hooks/useClipboard";
import { useRouter } from "next/router";
import { Post as PostType } from "../types/Post";
import { usePostDelete } from "../hooks/usePostDelete";
import { usePostUnpublish } from "../hooks/usePostUnpublish";
import { usePostPublish } from "../hooks/usePostPublish";
import { Syntax } from "./Syntax";
import { LikeButton } from "./LikeButton";
import { LikeCount } from "./LikeCount";
import { PostComments } from "./PostComments";

interface Props {
  post: PostType;
  isMyPost: boolean;
}

export const Post: React.FC<Props> = React.memo(function Post({
  post,
  isMyPost,
}) {
  const [commentsVisible, setCommentsVisible] = React.useState(false);
  const router = useRouter();
  const { deletePost, isLoading: isDeleting } = usePostDelete(post.id);
  const { unpublishPost, isLoading: isUnpublishing } = usePostUnpublish(
    post.id
  );
  const { publishPost, isLoading: isPublishing } = usePostPublish(post.id);
  const [isCopied, copy] = useCopyClipboard(post.content || "", {
    successDuration: 3000,
  });

  const handleCommentClick = React.useCallback(() => {
    setCommentsVisible(!commentsVisible);
  }, [commentsVisible]);

  const handleDeletePost = React.useCallback(() => deletePost(), [deletePost]);

  const handleUnpublishPost = React.useCallback(
    () => unpublishPost(),
    [unpublishPost]
  );

  const handlepublishPost = React.useCallback(
    () => publishPost(),
    [publishPost]
  );

  const handleClipboardCopy = React.useCallback(() => copy(), [copy]);

  const handleTweetClick = React.useCallback(() => {
    window.open(`https://twitter.com/intent/tweet?text=Hello%20world`);
  }, []);

  const handleEditClick = React.useCallback(() => {
    router.push(`/p/${post.id}/edit`);
  }, []);

  return (
    <Box sx={{ borderColor: "gray", borderWidth: 1, borderStyle: "solid" }}>
      <Flex flexDirection="column">
        <Box sx={{ padding: 2 }}>
          <Flex alignItems="center">
            <RouterLink sx={{ marginRight: 2 }} href={`/p/${post.id}`}>
              {post.title}
            </RouterLink>
            <Box sx={{ marginRight: 2 }}>
              <Text>by</Text>
            </Box>
            <Box sx={{ marginRight: 1 }}>
              {post.author && <UserPreview user={post.author} />}
            </Box>
            <Box sx={{ marginRight: 1 }}>
              <Text>{`${post.published ? "Published" : "Draft"}`}</Text>
            </Box>
            <Box>
              <LikeCount post={post} />
            </Box>
          </Flex>
          <Flex flexDirection="column">
            <Markdown value={post.description || ""} />
          </Flex>
          <Syntax value={post.content || ""} />
        </Box>
        <Box>
          <Box
            sx={{
              borderTopColor: "white",
              borderTopWidth: 1,
              borderStyle: "solid",
              padding: 1,
            }}
          >
            <LikeButton post={post} />
            <Button onClick={handleCommentClick}>
              {/* <Comment /> */}
              <Text>{`Comment (${post.comments.length})`}</Text>
            </Button>
            <Button onClick={handleTweetClick}>
              {/* <Share /> */}
              <Text>Tweet</Text>
            </Button>
            <Button onClick={handleClipboardCopy} disabled={isCopied}>
              {/* <Copy /> */}
              <Text>{isCopied ? "Copied!" : "Copy snippet"}</Text>
            </Button>
            {isMyPost && (
              <Button onClick={handleEditClick}>
                {/* <Edit /> */}
                <Text>Edit</Text>
              </Button>
            )}
            {isMyPost &&
              (post.published ? (
                <Button onClick={handleUnpublishPost} disabled={isUnpublishing}>
                  {/* <PublishRemove /> */}
                  <Text>Unpublish</Text>
                </Button>
              ) : (
                <Button onClick={handlepublishPost} disabled={isPublishing}>
                  {/* <PublishCheck /> */}
                  <Text>Publish</Text>
                </Button>
              ))}
            {isMyPost && (
              <Button onClick={handleDeletePost} disabled={isDeleting}>
                {/* <DeleteOutline /> */}
                <Text>Remove</Text>
              </Button>
            )}
          </Box>
        </Box>
        <Box>
          {commentsVisible && (
            <Box>
              <PostComments post={post} />
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  );
});
