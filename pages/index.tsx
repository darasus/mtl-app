import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { Post } from "../components/Post";
import { Box, Button, Flex, Heading, Spinner } from "@chakra-ui/react";
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

const Index: React.FC = () => {
  const feed = useFeedQuery();
  const me = useMeQuery();

  return (
    <Layout>
      <main>
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
                <Post post={post} isMyPost={post.authorId === me.data?.id} />
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
              Load more
            </Button>
          </Flex>
        )}
      </main>
    </Layout>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();
  const me = await prefetchMe(ctx, queryClient);
  const feedService = new FeedService();

  await queryClient.prefetchQuery(createUseFeedQueryCacheKey(), async () => {
    const page = await feedService.fetchFeed({
      userId: me?.id || undefined,
    });
    return {
      pages: [page],
    };
  });

  return {
    props: {
      cookies: ctx.req.headers.cookie ?? "",
      dehydratedState: dehydrate(queryClient),
    },
  };
};
