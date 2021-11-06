import React from "react";
import { Post } from "../../../components/Post";
import { usePostQuery } from "../../../hooks/query/usePostQuery";
import { useRouter } from "next/router";
import { PreviewLayout } from "../../../layouts/PreviewLayout";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Logo } from "../../../components/Logo";

const PostPage: React.FC = () => {
  const router = useRouter();
  const post = usePostQuery(router.query.id as string);

  if (!post.data) return null;

  return (
    <PreviewLayout>
      <main>
        <Post
          postId={post.data.id}
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
