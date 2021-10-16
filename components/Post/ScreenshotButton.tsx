import { Button, Text } from "@chakra-ui/react";
import { PhotographIcon } from "@heroicons/react/outline";
import { paramCase } from "change-case";
import React from "react";
import download from "js-file-download";
import { useScreenshotQuery } from "../../hooks/query/useScreenshotQuery";

interface Props {
  title: string;
  postId: number;
}

export const ScreenshotButton: React.FC<Props> = ({ title, postId }) => {
  const url = `${globalThis.location?.origin}/p/${postId}/preview`;
  const { refetch, isFetching } = useScreenshotQuery(url);
  const handleClick = React.useCallback(async () => {
    const screenshot = await refetch();
    download(screenshot.data!, `${paramCase(title)}.png`, "image/png");
  }, [refetch, title]);

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
    >
      <Text>Screenshot</Text>
    </Button>
  );
};
