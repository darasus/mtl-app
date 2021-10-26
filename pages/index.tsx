import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { Post } from "../components/Post";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import React from "react";
import { dehydrate } from "react-query/hydration";
import { useFeedQuery } from "../hooks/query/useFeedQuery";
import {
  createUseMeQueryCacheKey,
  useMeQuery,
} from "../hooks/query/useMeQuery";
import { Layout } from "../layouts/Layout";
import { Head } from "../components/Head";
import { createIsFirstServerCall } from "../utils/createIsFirstServerCall";
import { Intro } from "../components/Intro";
import { ServerHttpConnector } from "../lib/ServerHttpConnector";
import { Fetcher } from "../lib/Fetcher";
import { FeedType } from "../types/FeedType";
import { Heading } from "../components/Heading";
import { useColors } from "../hooks/useColors";

const Index: React.FC = () => {
  const [feedType, setFeedType] = React.useState(FeedType.Latest);
  const feed = useFeedQuery({ feedType });
  const me = useMeQuery();

  return (
    <>
      <Head title="Home" urlPath="" />
      <Layout>
        <main>
          {!me.data && (
            <Center height="50vh">
              <Intro withSignIn />
            </Center>
          )}
          <Heading title="Library feed">
            <ButtonGroup isAttached variant="solid">
              <Button
                size="xs"
                variant={feedType === FeedType.Latest ? "cta" : "solid"}
                onClick={() => setFeedType(FeedType.Latest)}
                mr="0px"
              >
                Latest
              </Button>
              <Button
                size="xs"
                variant={feedType === FeedType.Following ? "cta" : "solid"}
                onClick={() => setFeedType(FeedType.Following)}
              >
                Following
              </Button>
            </ButtonGroup>
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

  if (!createIsFirstServerCall(ctx)) {
    return {
      props: {
        cookies: ctx.req.headers.cookie ?? "",
      },
    };
  }

  const httpConnector = new ServerHttpConnector(ctx);
  const fetcher = new Fetcher(httpConnector);

  await queryClient.prefetchQuery(createUseMeQueryCacheKey(), () =>
    fetcher.getMe()
  );

  return {
    props: {
      cookies: ctx.req.headers.cookie ?? "",
      dehydratedState: dehydrate(queryClient),
    },
  };
};
