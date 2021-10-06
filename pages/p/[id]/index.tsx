import React from "react";
import { GetServerSideProps } from "next";
import { Post } from "../../../components/Post";
import { usePostQuery } from "../../../hooks/query/usePostQuery";
import { useRouter } from "next/router";
import { useMeQuery } from "../../../hooks/query/useMeQuery";
import { Layout } from "../../../layouts/Layout";
import { QueryClient } from "react-query";
import { prefetchMe } from "../../../services/utils/prefetchMe";
import { dehydrate } from "react-query/hydration";
import { Flex, Spinner } from "@chakra-ui/react";

const PostPage: React.FC = () => {
  const router = useRouter();
  const post = usePostQuery(Number(router.query.id));
  const me = useMeQuery();

  return (
    <Layout>
      <main>
        {post.isLoading && (
          <Flex justifyContent="center" mt={5} mb={5}>
            <Spinner />
          </Flex>
        )}
        {post.data && (
          <Post
            post={post.data}
            isMyPost={post.data.authorId === me.data?.id}
            isPostLoading={post.isFetching}
          />
        )}
      </main>
    </Layout>
  );
};

export default PostPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();
  await prefetchMe(ctx, queryClient);

  return {
    props: {
      cookies: ctx.req.headers.cookie ?? "",
      dehydratedState: dehydrate(queryClient),
    },
  };
};
