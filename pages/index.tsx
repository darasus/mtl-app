import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { Post } from "../components/Post";
import { Box, Button, Center, Flex, Heading, Spinner } from "@chakra-ui/react";
import React from "react";
import { dehydrate } from "react-query/hydration";
import {
  createUseFeedQueryCacheKey,
  useFeedQuery,
} from "../hooks/query/useFeedQuery";
import { useMeQuery } from "../hooks/query/useMeQuery";
import { Layout } from "../layouts/Layout";
import { FeedService } from "../services/api/FeedService";
import { prefetchMe } from "../services/utils/prefetchMe";
import { useRouter } from "next/router";
import { Head } from "../components/Head";
import { commentsKey } from "../hooks/query/useCommentsQuery";
import { createUsePostQueryCacheKey } from "../hooks/query/usePostQuery";

const Index: React.FC = () => {
  const feed = useFeedQuery();
  const me = useMeQuery();
  const router = useRouter();

  return (
    <>
      <Head />
      <Layout>
        <main>
          {!me.data && (
            <Center height="50vh">
              <Flex alignItems="center" direction="column">
                <Flex>
                  <Heading size="3xl" mr={3}>
                    This is
                  </Heading>
                  <Heading size="3xl" color="brand">
                    My Tiny Library
                  </Heading>
                </Flex>
                <Box mb={3} />
                <Heading size="xl">
                  The best way to share your code with your peers
                </Heading>
                <Box mb={5} />
                <Button
                  variant="outline"
                  borderColor="brand"
                  color="brand"
                  onClick={() => router.push("/auth/signin")}
                >
                  Sign in
                </Button>
              </Flex>
            </Center>
          )}
          <Heading mb={10} variant="section-heading">
            Latest libraries
          </Heading>
          {feed.isLoading && (
            <Flex justifyContent="center" mt={5} mb={5}>
              <Spinner />
            </Flex>
          )}
          {feed.data?.pages.map((page) => {
            return page.items.map((post) => {
              return (
                <Box key={post.id} mb={6}>
                  <Post
                    postId={post.id}
                    isMyPost={post.authorId === me.data?.id}
                  />
                </Box>
              );
            });
          })}
          {feed.hasNextPage && (
            <Flex justifyContent="center">
              <Button
                color="brand"
                borderColor="brand"
                variant="outline"
                size="sm"
                isLoading={feed.isFetchingNextPage}
                onClick={() => feed.fetchNextPage()}
              >
                Load more...
              </Button>
            </Flex>
          )}
        </main>
      </Layout>
    </>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();
  const isFirstServerCall = ctx.req?.url?.indexOf("/_next/data/") === -1;

  if (isFirstServerCall) {
    const me = await prefetchMe(ctx, queryClient);
    const feedService = new FeedService();
    const page = await feedService.fetchFeed({
      userId: me?.id || undefined,
    });

    await queryClient.prefetchQuery(createUseFeedQueryCacheKey(), () =>
      Promise.resolve({
        pages: [page],
      })
    );

    page.items.forEach((post) => {
      queryClient.setQueryData(createUsePostQueryCacheKey(post.id), post);
      queryClient.setQueryData(commentsKey.postComments(post.id), {
        items: post.comments,
        count: post.comments.length,
        total: post.commentsCount,
      });
    });
  }

  return {
    props: {
      cookies: ctx.req.headers.cookie ?? "",
      dehydratedState: dehydrate(queryClient),
    },
  };
};
