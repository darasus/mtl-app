import React from "react";
import { GetServerSideProps } from "next";
import { Post } from "../../../components/Post";
import {
  createUsePostQueryCacheKey,
  usePostQuery,
} from "../../../hooks/query/usePostQuery";
import { useRouter } from "next/router";
import {
  createUseMeQueryCacheKey,
  useMeQuery,
} from "../../../hooks/query/useMeQuery";
import { Layout } from "../../../layouts/Layout";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { Flex, Spinner } from "@chakra-ui/react";
import { Head } from "../../../components/Head";
import { createIsFirstServerCall } from "../../../utils/createIsFirstServerCall";
import { commentsKey } from "../../../hooks/query/useCommentsQuery";
import { Fetcher } from "../../../lib/Fetcher";
import { ServerHttpConnector } from "../../../lib/ServerHttpConnector";

const PostPage: React.FC = () => {
  const router = useRouter();
  const post = usePostQuery(Number(router.query.id));
  const me = useMeQuery();
  const imageUrl = `${process.env.NEXTAUTH_URL}/api/screenshot?url=${
    process.env.NEXTAUTH_URL
  }/p/${router.query.id}/thumbnail?updateDate=${new Date(
    post.data?.updatedAt!
  ).getTime()}`;

  return (
    <>
      <Head
        title={post.data?.title!}
        description={post.data?.description!}
        urlPath={`p/${post.data?.id}`}
        facebookImage={imageUrl}
        twitterImage={imageUrl}
      />
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
              isPostStatusVisible={true}
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

  if (!createIsFirstServerCall(ctx)) {
    return {
      props: {
        cookies: ctx.req.headers.cookie ?? "",
      },
    };
  }

  const httpConnector = new ServerHttpConnector(ctx);
  const fetcher = new Fetcher(httpConnector);

  const postId = Number(ctx.query.id);
  const post = await fetcher.getPost(postId);

  await Promise.all([
    queryClient.prefetchQuery(createUseMeQueryCacheKey(), () =>
      fetcher.getMe()
    ),
    queryClient.prefetchQuery(createUsePostQueryCacheKey(postId), () =>
      Promise.resolve(post)
    ),
    queryClient.prefetchQuery(commentsKey.postComments(post.id), () =>
      Promise.resolve({
        items: post.comments,
        total: post.commentsCount,
        count: post.comments.length,
      })
    ),
  ]);

  return {
    props: {
      cookies: ctx.req.headers.cookie ?? "",
      dehydratedState: dehydrate(queryClient),
    },
  };
};
