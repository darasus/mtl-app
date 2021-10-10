import { Button, Text } from "@chakra-ui/react";
import { PhotographIcon } from "@heroicons/react/outline";
import { paramCase } from "change-case";
import React from "react";
import download from "js-file-download";
import { request } from "../../lib/request";

interface Props {
  title: string;
  postId: number;
}

export const ScreenshotButton: React.FC<Props> = ({ title, postId }) => {
  const handleClick = () => {
    return request(`/api/post/${postId}/screenshot`).then((res) => {
      download(res.data, `${paramCase(title)}.png`);
    });
  };

  return (
    <Button
      leftIcon={<PhotographIcon width="15" height="15" />}
      variant="ghost"
      size="xs"
      mr={2}
      as="a"
      onClick={handleClick}
    >
      <Text>Screenshot</Text>
    </Button>
  );
};
