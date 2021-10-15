import React from "react";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Layout } from "../../layouts/Layout";
import { GetServerSideProps } from "next";
import { prefetchMe } from "../../services/utils/prefetchMe";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { createIsFirstServerCall } from "../../utils/createIsFirstServerCall";
import { usePostCreateMutation } from "../../hooks/mutation/usePostCreateMutation";
import { PostForm, postSchema } from "../../features/PostForm";

const CreatePostPage: React.FC = () => {
  const router = useRouter();
  const createPostMutation = usePostCreateMutation();
  const form = useForm<PostForm>({
    resolver: yupResolver(postSchema),
  });

  const submit = form.handleSubmit(async (data) => {
    const post = await createPostMutation.mutateAsync(data);
    await router.push(`/p/${post.id}`);
  });

  return (
    <Layout>
      <FormProvider {...form}>
        <PostForm submit={submit} isSubmitting={createPostMutation.isLoading} />
      </FormProvider>
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
