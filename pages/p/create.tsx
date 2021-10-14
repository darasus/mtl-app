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
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { CodeEditor } from "../../components/CodeEditor";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Layout } from "../../layouts/Layout";
import { useColors } from "../../hooks/useColors";
import { GetServerSideProps } from "next";
import { prefetchMe } from "../../services/utils/prefetchMe";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { createIsFirstServerCall } from "../../utils/createIsFirstServerCall";
import { usePostCreateMutation } from "../../hooks/mutation/usePostCreateMutation";

interface Form {
  title: string;
  description: string;
  content: string;
}

const schema = yup.object().shape({
  title: yup.string().min(3).max(100).required(),
  description: yup.string().min(3).max(1000).required(),
  content: yup.string().min(3).max(1000).required(),
});

const CreatePostPage: React.FC = () => {
  const { secondaryTextColor } = useColors();
  const router = useRouter();
  const createPostMutation = usePostCreateMutation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Form>({
    resolver: yupResolver(schema),
  });

  const submit = handleSubmit(async (data) => {
    const post = await createPostMutation.mutateAsync(data);
    await router.push(`/p/${post.id}`);
  });

  return (
    <Layout>
      <Box>
        <form onSubmit={submit}>
          <Heading mb={10} variant="section-heading">
            Create new javascript library
          </Heading>
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
                <CodeEditor value={value} onChange={onChange} />
              )}
            />
          </Box>
          <Flex>
            <Button
              type="submit"
              marginRight="size-200"
              disabled={createPostMutation.isLoading}
              variant="solid"
              isLoading={createPostMutation.isLoading}
              loadingText="Publish"
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

export default CreatePostPage;

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
