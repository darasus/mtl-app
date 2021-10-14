import React from "react";
import { GetServerSideProps } from "next";
import { Post } from "../../../components/Post";
import {
  createUsePostQueryCacheKey,
  usePostQuery,
} from "../../../hooks/query/usePostQuery";
import { useRouter } from "next/router";
import { useMeQuery } from "../../../hooks/query/useMeQuery";
import { Layout } from "../../../layouts/Layout";
import { QueryClient } from "react-query";
import { prefetchMe } from "../../../services/utils/prefetchMe";
import { dehydrate } from "react-query/hydration";
import { Flex, Spinner } from "@chakra-ui/react";
import { fetchPost } from "../../../request/fetchPost";
import { Head } from "../../../components/Head";
import { createIsFirstServerCall } from "../../../utils/createIsFirstServerCall";

const PostPage: React.FC = () => {
  const router = useRouter();
  const post = usePostQuery(Number(router.query.id));
  const me = useMeQuery();

  return (
    <>
      <Head title={post.data?.title!} />
      <Layout>
        <main>
          {post.isLoading && (
            <Flex justifyContent="center" mt={5} mb={5}>
              <Spinner />
            </Flex>
          )}
          {post.data && (
            <Post
              postId={post.data.id}
              isMyPost={post.data.authorId === me.data?.id}
              isPostLoading={post.isFetching}
            />
          )}
        </main>
      </Layout>
    </>
  );
};

export default PostPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();

  if (createIsFirstServerCall(ctx)) {
    const postId = Number(ctx.query.id);

    await Promise.all([
      prefetchMe(ctx, queryClient),
      queryClient.prefetchQuery(createUsePostQueryCacheKey(postId), () =>
        fetchPost(postId)
      ),
    ]);
  }

  return {
    props: {
      cookies: ctx.req.headers.cookie ?? "",
      dehydratedState: dehydrate(queryClient),
    },
  };
};
