import { GetStaticProps } from "next";
import { Layout } from "../components/Layout";
import { Post, PostProps } from "../components/Post";
import prisma from "../lib/prisma";

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
  return {
    props: { feed },
  };
};

type Props = {
  feed: PostProps[];
};

const Index: React.FC<Props> = (props) => {
  return (
    <Layout>
      <main>
        {props.feed.map((post) => (
          <div key={post.id}>
            <Post post={post} />
          </div>
        ))}
      </main>
    </Layout>
  );
};

export default Index;
