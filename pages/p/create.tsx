import React from "react";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FullscreenLayout } from "../../layouts/FullscreenLayout";
import { GetServerSideProps } from "next";
import { prefetchMe } from "../../lib/utils/prefetchMe";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { createIsFirstServerCall } from "../../utils/createIsFirstServerCall";
import { useCreatePostMutation } from "../../hooks/mutation/useCreatePostMutation";
import { PostForm, postSchema } from "../../features/PostForm";
import invariant from "invariant";
import { CodeLanguage } from ".prisma/client";
import { Head } from "../../components/Head";
import { slogan } from "../../constants/slogan";
import { introImageUrl } from "../../constants/introImageUrl";

const CreatePostPage: React.FC = () => {
  const router = useRouter();
  const createPostMutation = useCreatePostMutation();
  const form = useForm<PostForm>({
    defaultValues: {
      codeLanguage: CodeLanguage.JAVASCRIPT,
    },
    resolver: yupResolver(postSchema),
  });

  const handlePublish = form.handleSubmit(
    async ({ tagId, codeLanguage, content, description, title }) => {
      invariant(typeof tagId === "number", "tagId is required");
      const post = await createPostMutation.mutateAsync({
        tagId,
        codeLanguage,
        content,
        description,
        title,
        isPublished: true,
      });
      await router.push(`/p/${post.id}`);
    }
  );

  const handleSave = form.handleSubmit(
    async ({ tagId, codeLanguage, content, description, title }) => {
      invariant(typeof tagId === "number", "tagId is required");
      const post = await createPostMutation.mutateAsync({
        tagId,
        codeLanguage,
        content,
        description,
        title,
        isPublished: false,
      });
      await router.push(`/p/${post.id}`);
    }
  );

  return (
    <>
      <Head title="Create tiny library" urlPath="/create" />
      <FullscreenLayout>
        <FormProvider {...form}>
          <PostForm
            handlePublish={handlePublish}
            isPublishing={createPostMutation.isLoading}
            handleSave={handleSave}
            isSaving={createPostMutation.isLoading}
          />
        </FormProvider>
      </FullscreenLayout>
    </>
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
