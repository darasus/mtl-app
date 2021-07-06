import {
  Button,
  Flex,
  Text,
  TextArea,
  TextField,
  Tooltip,
  TooltipTrigger,
  View,
} from "@adobe/react-spectrum";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useMeQuery } from "../hooks/useMeQuery";
import { usePostComment } from "../hooks/usePostComment";
import { Post } from "../types/Post";
import { UserProfilePic } from "./UserPreview";

interface Props {
  post: Post;
}

export const PostComments: React.FC<Props> = ({ post }) => {
  const me = useMeQuery();
  const { commentPost, isLoading } = usePostComment();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { comment: "" },
  });

  const submit = handleSubmit(async (data) => {
    await commentPost(post.id, data.comment);
    reset();
  });

  if (!me.data) return null;

  return (
    <>
      <View borderTopColor="gray-900" borderTopWidth="thin" padding="size-200">
        {post.comments.map((comment, i) => {
          if (!comment.author) return null;
          return (
            <Flex
              key={comment.id}
              gap="size-200"
              marginBottom={post.comments.length === i + 1 ? "" : "size-100"}
            >
              <UserProfilePic user={comment.author} />
              <View>
                <Flex gap="size-100">
                  <Text>{comment.author.name}</Text>
                  <Text>-</Text>
                  <Text>{new Date(comment.createdAt).toDateString()}</Text>
                </Flex>
                <Text>{comment.content}</Text>
              </View>
            </Flex>
          );
        })}
      </View>
      <form onSubmit={submit}>
        <View
          borderTopColor="gray-400"
          borderTopWidth="thin"
          padding="size-200"
        >
          <Flex gap="size-200">
            <UserProfilePic user={me.data} />
            <View flexGrow={1}>
              <Controller
                name="comment"
                control={control}
                render={({ field }) => (
                  <TextArea
                    width="100%"
                    autoComplete="false"
                    isDisabled={isLoading}
                    name={field.name}
                    onBlur={field.onBlur}
                    value={field.value}
                    aria-label="comment field"
                    onChange={(value) => field.onChange(value)}
                    placeholder="Type your comment here..."
                  />
                )}
              />
            </View>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Flex>
        </View>
      </form>
    </>
  );
};
