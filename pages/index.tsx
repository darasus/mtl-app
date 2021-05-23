import axios from "axios";
import { GetServerSideProps, GetStaticProps } from "next";
import { getSession } from "next-auth/client";
import { QueryClient } from "react-query";
import { Layout } from "../components/Layout";
import { Post } from "../components/Post";
import prisma from "../lib/prisma";
import { fetchMe } from "../request/fetchMe";
import Prisma from ".prisma/client";
import { View } from "@react-spectrum/view";

type Props = {
  feed: (Prisma.Post & { author: Prisma.User })[];
};

const Index: React.FC<Props> = (props) => {
  return (
    <Layout>
      <main>
        {props.feed.map((post) => (
          <View key={post.id} marginBottom="size-100">
            <Post post={post} />
          </View>
        ))}
      </main>
    </Layout>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async (): Promise<{
  props: Props;
}> => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("me", fetchMe);

  const feed = await prisma.post.findMany({
    where: {
      published: false,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          userName: true,
          image: true,
          emailVerified: true,
          createdAt: true,
          email: true,
          updatedAt: true,
        },
      },
    },
  });

  return {
    props: { feed },
  };
};
