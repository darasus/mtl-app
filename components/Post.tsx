import React from "react";
import { UserPreview } from "./UserPreview";
import { Markdown } from "./Markdown";
import { Flex } from "@react-spectrum/layout";
import { View } from "@react-spectrum/view";
import { Text } from "@react-spectrum/text";
import { RouterLink } from "./RouterLinkt";
import { ActionButton } from "@react-spectrum/button";
import DeleteOutline from "@spectrum-icons/workflow/DeleteOutline";
import Share from "@spectrum-icons/workflow/Share";
import Copy from "@spectrum-icons/workflow/Copy";
import Edit from "@spectrum-icons/workflow/Edit";
import Comment from "@spectrum-icons/workflow/Comment";
import PublishRemove from "@spectrum-icons/workflow/PublishRemove";
import PublishCheck from "@spectrum-icons/workflow/PublishCheck";
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
    <View borderColor="gray-900" borderWidth="thin">
      <Flex direction="column">
        <View padding="size-200">
          <Flex alignItems="center">
            <RouterLink marginEnd="size-100" href={`/p/${post.id}`}>
              {post.title}
            </RouterLink>
            <View marginEnd="size-100">
              <Text>by</Text>
            </View>
            <View marginEnd="size-100">
              {post.author && <UserPreview user={post.author} />}
            </View>
            <View marginEnd="size-100">
              <Text>{`${post.published ? "Published" : "Draft"}`}</Text>
            </View>
            <View>
              <LikeCount post={post} />
            </View>
          </Flex>
          <Flex direction="column">
            <Markdown value={post.description || ""} />
          </Flex>
          <Syntax value={post.content || ""} />
        </View>
        <View>
          <View
            borderTopColor="gray-900"
            borderTopWidth="thin"
            padding="size-100"
          >
            <LikeButton post={post} />
            <ActionButton isQuiet onPress={handleCommentClick}>
              <Comment />
              <Text>{`Comment (${post.comments.length})`}</Text>
            </ActionButton>
            <ActionButton isQuiet onPress={handleTweetClick}>
              <Share />
              <Text>Tweet</Text>
            </ActionButton>
            <ActionButton
              isQuiet
              onPress={handleClipboardCopy}
              isDisabled={isCopied}
            >
              <Copy />
              <Text>{isCopied ? "Copied!" : "Copy snippet"}</Text>
            </ActionButton>
            {isMyPost && (
              <ActionButton isQuiet onPress={handleEditClick}>
                <Edit />
                <Text>Edit</Text>
              </ActionButton>
            )}
            {isMyPost &&
              (post.published ? (
                <ActionButton
                  isQuiet
                  onPress={handleUnpublishPost}
                  isDisabled={isUnpublishing}
                >
                  <PublishRemove />
                  <Text>Unpublish</Text>
                </ActionButton>
              ) : (
                <ActionButton
                  isQuiet
                  onPress={handlepublishPost}
                  isDisabled={isPublishing}
                >
                  <PublishCheck />
                  <Text>Publish</Text>
                </ActionButton>
              ))}
            {isMyPost && (
              <ActionButton
                isQuiet
                onPress={handleDeletePost}
                isDisabled={isDeleting}
              >
                <DeleteOutline />
                <Text>Remove</Text>
              </ActionButton>
            )}
          </View>
        </View>
        <View>
          {commentsVisible && (
            <View>
              <PostComments post={post} />
            </View>
          )}
        </View>
      </Flex>
    </View>
  );
});
