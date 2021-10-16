import { Button, Text } from "@chakra-ui/react";
import { PhotographIcon } from "@heroicons/react/outline";
import { paramCase } from "change-case";
import React from "react";
import download from "js-file-download";
import { useScreenshotQuery } from "../../hooks/query/useScreenshotQuery";
import { Post } from "../../types/Post";

interface Props {
  post: Post;
}

export const ScreenshotButton: React.FC<Props> = ({ post }) => {
  const url = `${globalThis.location?.origin}/p/${
    post.id
  }/preview?updateDate=${new Date(post.updatedAt).getTime()}`;
  const { refetch, isFetching } = useScreenshotQuery(url);

  const handleClick = React.useCallback(async () => {
    const screenshot = await refetch();
    download(screenshot.data!, `${paramCase(post.title)}.png`, "image/png");
  }, [refetch, post]);

  return (
    <Button
      leftIcon={<PhotographIcon width="15" height="15" />}
      variant="ghost"
      size="xs"
      mr={2}
      as="a"
      onClick={handleClick}
      isLoading={isFetching}
      loadingText={"Screenshot"}
      cursor="pointer"
    >
      <Text>Screenshot</Text>
    </Button>
  );
};
