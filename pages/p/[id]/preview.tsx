import React from "react";
import { GetServerSideProps } from "next";
import { Post } from "../../../components/Post";
import { QueryClient } from "react-query";
import { usePostQuery } from "../../../hooks/query/usePostQuery";
import { useRouter } from "next/router";
import { dehydrate } from "react-query/hydration";
import { useMeQuery } from "../../../hooks/query/useMeQuery";
import { PreviewLayout } from "../../../layouts/PreviewLayout";
import { prefetchMe } from "../../../services/utils/prefetchMe";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Logo } from "../../../components/Logo";
import { createIsFirstServerCall } from "../../../utils/createIsFirstServerCall";

const PostPage: React.FC = () => {
  const router = useRouter();
  const post = usePostQuery(Number(router.query.id));
  const me = useMeQuery();

  if (!post.data) return null;

  return (
    <PreviewLayout>
      <main>
        <Post
          postId={post.data.id}
          isMyPost={post.data.authorId === me.data?.id}
          showActionMenu={false}
          showMetaInfo={false}
        />
        <Box mt={5}>
          <Flex alignItems="center" justifyContent="center">
            <Box mr={1.5}>
              <Text>Created with</Text>
            </Box>
            <Box style={{ marginBottom: -10 }}>
              <Logo />
            </Box>
          </Flex>
        </Box>
      </main>
    </PreviewLayout>
  );
};

export default PostPage;

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
