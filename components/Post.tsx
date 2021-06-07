import React from "react";
import { UserPreview } from "./UserPreview";
import { CodePreview } from "./CodePreview";
import { Markdown } from "./Markdown";
import Prisma from ".prisma/client";
import { Flex } from "@react-spectrum/layout";
import { View } from "@react-spectrum/view";
import { Text } from "@react-spectrum/text";
import { RouterLink } from "./RouterLinkt";
import { ActionButton } from "@react-spectrum/button";
import DeleteOutline from "@spectrum-icons/workflow/DeleteOutline";
import Share from "@spectrum-icons/workflow/Share";
import Copy from "@spectrum-icons/workflow/Copy";
import Edit from "@spectrum-icons/workflow/Edit";
import PublishRemove from "@spectrum-icons/workflow/PublishRemove";
import PublishCheck from "@spectrum-icons/workflow/PublishCheck";
import useCopyClipboard from "../hooks/useClipboard";
import { useRouter } from "next/router";
import { Post as PostType } from "../types/Post";
import { usePostDelete } from "../hooks/usePostDelete";
import { usePostUnpublish } from "../hooks/usePostUnpublish";
import { usePostPublish } from "../hooks/usePostPublish";

interface Props {
  post: PostType;
}

export const Post: React.FC<Props> = React.memo(function Post({ post }) {
  const router = useRouter();
  const { deletePost } = usePostDelete(post.id);
  const { unpublishPost } = usePostUnpublish(post.id);
  const { publishPost } = usePostPublish(post.id);
  const [isCopied, copy] = useCopyClipboard(post.content, {
    successDuration: 3000,
  });

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
    <>
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
                <UserPreview user={post.author} />
              </View>
              <View>
                <Text>{`${post.published ? "Published" : "Draft"}`}</Text>
              </View>
            </Flex>
            <Flex>
              <Text>
                <Markdown value={post.description} />
              </Text>
            </Flex>
            <CodePreview value={post.content} />
          </View>
          <View>
            <View
              borderTopColor="gray-900"
              borderTopWidth="thin"
              padding="size-100"
            >
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
              <ActionButton isQuiet onPress={handleEditClick}>
                <Edit />
                <Text>Edit</Text>
              </ActionButton>
              {post.published ? (
                <ActionButton isQuiet onPress={handleUnpublishPost}>
                  <PublishRemove />
                  <Text>Unpublish</Text>
                </ActionButton>
              ) : (
                <ActionButton isQuiet onPress={handlepublishPost}>
                  <PublishCheck />
                  <Text>Publish</Text>
                </ActionButton>
              )}
              <ActionButton isQuiet onPress={handleDeletePost}>
                <DeleteOutline />
                <Text>Remove</Text>
              </ActionButton>
            </View>
          </View>
        </Flex>
      </View>
    </>
  );
});
