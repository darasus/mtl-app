import { Flex, Text, TextField, View } from "@adobe/react-spectrum";
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
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: { comment: "" } });

  const submit = handleSubmit(async (data) => {
    await commentPost(post.id, data.comment);
    reset();
  });

  if (!me.data) return null;

  return (
    <>
      {post.comments.map((comment) => (
        <View key={comment.id}>
          <Text>{comment.author?.name}</Text>
          <Text>{comment.createdAt}</Text>
          <Text>{comment.content}</Text>
        </View>
      ))}
      <form onSubmit={submit}>
        <View>
          <Flex width="single-line-0">
            <UserProfilePic user={me.data} />
            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <TextField
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
          </Flex>
        </View>
      </form>
    </>
  );
};
