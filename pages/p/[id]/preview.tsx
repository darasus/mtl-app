import React from "react";
import { GetServerSideProps } from "next";
import { Post } from "../../../components/Post";
import { QueryClient } from "react-query";
import { usePostQuery } from "../../../hooks/query/usePostQuery";
import { useRouter } from "next/router";
import { fetchPost } from "../../../request/fetchPost";
import { dehydrate } from "react-query/hydration";
import { useMeQuery } from "../../../hooks/query/useMeQuery";
import { PreviewLayout } from "../../../layouts/PreviewLayout";
import { prefetchMe } from "../../../services/utils/prefetchMe";

const PostPage: React.FC = () => {
  const router = useRouter();
  const post = usePostQuery(Number(router.query.id));
  const me = useMeQuery();

  if (!post.data) return null;

  return (
    <PreviewLayout>
      <main>
        <Post
          post={post.data}
          isMyPost={post.data.authorId === me.data?.id}
          showActionMenu={false}
        />
      </main>
    </PreviewLayout>
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
