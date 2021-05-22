import React from "react";
import { GetServerSideProps } from "next";
import { Layout } from "../../components/Layout";
import prisma from "../../lib/prisma";
import Prisma from ".prisma/client";
import { Post } from "../../components/Post";
import { QueryClient } from "react-query";
import { fetchMe } from "../../request/fetchMe";

interface Props {
  post: Prisma.Post & { author: Prisma.User };
}

const PostPage: React.FC<Props> = ({ post }) => {
  return (
    <Layout>
      <main>
        <Post post={post} />
      </main>
    </Layout>
  );
};

export default PostPage;

export const getServerSideProps: GetServerSideProps = async ({
  params,
}): Promise<{ props: Props }> => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("me", fetchMe);
  const post = await prisma.post.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
          id: true,
          userName: true,
          updatedAt: true,
          emailVerified: true,
          createdAt: true,
          image: true,
        },
      },
    },
  });

  return {
    props: { post },
  };
};
