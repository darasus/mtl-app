import React from "react";
import { useRouter } from "next/router";
import {
  Textarea,
  Input,
  Heading,
  Box,
  Button,
  Flex,
  Text,
  Select,
} from "@chakra-ui/react";
import { dehydrate } from "react-query/hydration";
import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { fetchPost } from "../../../request/fetchPost";
import { usePostQuery } from "../../../hooks/query/usePostQuery";
import { usePostEdit } from "../../../hooks/usePostEdit";
import { Controller, useForm } from "react-hook-form";
import { CodeEditor } from "../../../components/CodeEditor";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Layout } from "../../../layouts/Layout";
import { useColors } from "../../../hooks/useColors";
import { prefetchMe } from "../../../services/utils/prefetchMe";
import { createIsFirstServerCall } from "../../../utils/createIsFirstServerCall";
import { CodeLanguage } from ".prisma/client";

interface Form {
  title: string;
  description: string;
  content: string;
  codeLanguage: CodeLanguage;
}

const schema = yup.object().shape({
  title: yup.string().min(3).max(100).required(),
  description: yup.string().min(3).max(1000).required(),
  content: yup.string().min(3).max(1000).required(),
});

const EditPostPage: React.FC = () => {
  const { secondaryTextColor } = useColors();
  const router = useRouter();
  const post = usePostQuery(Number(router.query.id));
  const { editPost, isLoading } = usePostEdit(post.data?.id as number);
  const {
    reset,
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<Form>({
    resolver: yupResolver(schema),
  });

  React.useEffect(() => {
    if (!post.data) return;
    const { title, description, content } = post.data;
    reset({
      title,
      description: description || "",
      content: content || "",
    });
  }, [post.data, reset]);

  const submit = handleSubmit(async ({ title, description, content }) => {
    await editPost({ title, description, content, isPublished: true });
    await router.push(`/p/${post.data?.id}`);
  });

  return (
    <Layout>
      <Box>
        <form onSubmit={submit}>
          <Heading
            mb={2}
            variant="section-heading"
          >{`Edit: ${post.data?.title}`}</Heading>
          <Box mb={3}>
            <Text mr={1} color={secondaryTextColor} mb={2}>
              Title
            </Text>
            {errors.title?.message && (
              <Text color="red.500" mb={2}>
                {errors.title?.message}
              </Text>
            )}
            <Input {...register("title")} isInvalid={!!errors.title?.message} />
          </Box>
          <Box mb={3}>
            <Flex>
              <Text color={secondaryTextColor}>Description</Text>
              {errors.description?.message && (
                <Text color="red.500" mb={2}>
                  {errors.description?.message}
                </Text>
              )}
            </Flex>
            <Textarea
              {...register("description")}
              isInvalid={!!errors.description?.message}
            />
          </Box>
          <Box mb={3}>
            <Flex>
              <Text color={secondaryTextColor}>Language</Text>
              {errors.codeLanguage?.message && (
                <Text color="red.500" mb={2}>
                  {errors.codeLanguage?.message}
                </Text>
              )}
            </Flex>
            <Select
              {...register("codeLanguage")}
              isInvalid={!!errors.codeLanguage?.message}
            >
              <option value={CodeLanguage.JAVASCRIPT}>JavaScript</option>
              <option value={CodeLanguage.TYPESCRIPT}>TypeScript</option>
            </Select>
          </Box>
          <Box mb={3}>
            <Text color={secondaryTextColor}>Little JavaScript library</Text>
            {errors.content?.message && (
              <Text color="red.500" mb={2}>
                {errors.content?.message}
              </Text>
            )}
            <Controller
              name="content"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CodeEditor
                  value={value}
                  onChange={onChange}
                  codeLanguage={watch("codeLanguage")}
                />
              )}
            />
          </Box>
          <Flex>
            <Button
              type="submit"
              marginRight="size-200"
              disabled={isLoading}
              variant="solid"
              mr={2}
            >
              Publish
            </Button>
          </Flex>
        </form>
      </Box>
    </Layout>
  );
};

export default EditPostPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();

  if (createIsFirstServerCall(ctx)) {
    await prefetchMe(ctx, queryClient);
  }

  return {
    props: {
      cookies: ctx.req.headers.cookie ?? "",
      dehydratedState: dehydrate(queryClient),
    },
  };
};
