import NextHead from "next/head";

interface Props {
  title?: string;
}

export const Head: React.FC<Props> = ({ title }) => {
  return (
    <NextHead>
      <title>{title ? `${title} | My Tiny Library` : "My Tiny Library"}</title>
    </NextHead>
  );
};
