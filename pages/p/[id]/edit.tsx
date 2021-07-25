import React from "react";
import { useRouter } from "next/router";
import { Textarea, Input, Label } from "@rebass/forms";
import { Heading, Box, Button, Flex } from "rebass";
import { Layout } from "../../../components/Layout";
import { dehydrate } from "react-query/hydration";
import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { fetchPost } from "../../../request/fetchPost";
import { usePostQuery } from "../../../hooks/usePostQuery";
import { usePostEdit } from "../../../hooks/usePostEdit";

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
      <Box>
        <form onSubmit={publish}>
          <Heading>{`Edit: ${title}`}</Heading>
          <Box marginBottom="size-200">
            <Label>Title</Label>
            <Input
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              value={title || ""}
              width="100%"
            />
          </Box>
          <Box marginBottom="size-200">
            <Label>Description</Label>
            <Textarea
              width="100%"
              onChange={(e) => setDescription(e.target.value)}
              placeholder=""
              value={description || ""}
            />
          </Box>
          <Box marginBottom="size-200">
            <Label>Little JavaScript library</Label>
            <Textarea
              width="100%"
              onChange={(e) => setContent(e.target.value)}
              value={content || ""}
            />
          </Box>
          <Flex>
            <Button
              variant="cta"
              type="submit"
              marginRight="size-200"
              disabled={isLoading}
            >
              Publish
            </Button>
            <Button variant="primary" disabled={isLoading} onClick={save}>
              Save
            </Button>
          </Flex>
        </form>
      </Box>
    </Layout>
  );
};

export default EditPostPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["post", context.query.id], () =>
    fetchPost(Number(context.query.id))
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
