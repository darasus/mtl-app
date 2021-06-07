import React from "react";
import { useRouter } from "next/router";
import { TextArea, TextField } from "@react-spectrum/textfield";
import { View } from "@react-spectrum/view";
import { Button } from "@react-spectrum/button";
import { Heading } from "@react-spectrum/text";
import { Layout } from "../../../components/Layout";
import { dehydrate } from "react-query/hydration";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { QueryClient } from "react-query";
import { fetchMe } from "../../../request/fetchMe";
import { fetchPost } from "../../../request/fetchPost";
import { usePostQuery } from "../../../hooks/usePostQuery";
import { usePostEdit } from "../../../hooks/usePostEdit";
import { Flex } from "@react-spectrum/layout";

const EditPostPage: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = React.useState<string | null>("");
  const [description, setDescription] = React.useState<string | null>("");
  const [content, setContent] = React.useState<string | null>("");
  const post = usePostQuery(Number(router.query.id));
  const { editPost, isLoading } = usePostEdit(post.data?.id as number);

  React.useEffect(() => {
    if (post.data && !title && !description && !content) {
      const { title, description, content } = post.data;
      setTitle(title);
      setDescription(description);
      setContent(content);
    }
  }, [post]);

  const publish = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      if (title && content && description) {
        await editPost({ title, content, description, isPublished: true });
        await router.push(`/p/${post.data?.id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const save = async () => {
    try {
      if (title && content && description) {
        await editPost({ title, content, description, isPublished: false });
        await router.push(`/p/${post.data?.id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <View>
        <form onSubmit={publish}>
          <Heading>{`Edit: ${title}`}</Heading>
          <View marginBottom="size-200">
            <TextField
              autoFocus
              onChange={setTitle}
              label="Title"
              type="text"
              value={title || ""}
              width="100%"
            />
          </View>
          <View marginBottom="size-200">
            <TextArea
              label="Description"
              width="100%"
              onChange={setDescription}
              placeholder=""
              value={description || ""}
            />
          </View>
          <View marginBottom="size-200">
            <TextArea
              width="100%"
              onChange={setContent}
              label="Little JavaScript library"
              value={content || ""}
            />
          </View>
          <Flex>
            <Button
              variant="cta"
              type="submit"
              marginEnd="size-200"
              isDisabled={isLoading}
            >
              Publish
            </Button>
            <Button variant="primary" isDisabled={isLoading} onPress={save}>
              Save
            </Button>
          </Flex>
        </form>
      </View>
    </Layout>
  );
};

export default EditPostPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const queryClient = new QueryClient();
  if (session) {
    await queryClient.prefetchQuery("me", fetchMe);
  }
  await queryClient.prefetchQuery(["post", context.query.id], () =>
    fetchPost(Number(context.query.id))
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
