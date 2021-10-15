import React from "react";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Layout } from "../../layouts/Layout";
import { GetServerSideProps } from "next";
import { prefetchMe } from "../../lib/utils/prefetchMe";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { createIsFirstServerCall } from "../../utils/createIsFirstServerCall";
import { usePostCreateMutation } from "../../hooks/mutation/usePostCreateMutation";
import { PostForm, postSchema } from "../../features/PostForm";
import invariant from "invariant";

const CreatePostPage: React.FC = () => {
  const router = useRouter();
  const createPostMutation = usePostCreateMutation();
  const form = useForm<PostForm>({
    resolver: yupResolver(postSchema),
  });

  const submit = form.handleSubmit(
    async ({ tagId, codeLanguage, content, description, title }) => {
      invariant(typeof tagId === "number", "tagId is required");
      const post = await createPostMutation.mutateAsync({
        tagId,
        codeLanguage,
        content,
        description,
        title,
      });
      await router.push(`/p/${post.id}`);
    }
  );

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
