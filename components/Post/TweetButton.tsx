import { Button, IconButton } from "@chakra-ui/button";
import { Text } from "@chakra-ui/layout";
import { useBreakpointValue } from "@chakra-ui/media-query";
import { ShareIcon } from "@heroicons/react/outline";
import React from "react";

export const TweetButton = ({ postId }: { postId: number }) => {
  const handleTweetClick = React.useCallback(() => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURI(
        `Check this: ${window.location.origin}/api/post/${postId}/screenshot`
      )}`
    );
  }, [postId]);

  const commonProps = {
    "aria-label": "Tweet button",
    onClick: handleTweetClick,
  } as const;

  const mobileButton = (
    <IconButton
      {...commonProps}
      icon={<ShareIcon width="20" height="20" />}
      variant="solid"
      size="sm"
    />
  );

  const desktopButton = (
    <Button
      {...commonProps}
      leftIcon={<ShareIcon width="15" height="15" />}
      variant="ghost"
      size="xs"
    >
      <Text>Tweet</Text>
    </Button>
  );

  const buttonComponent = useBreakpointValue({
    base: mobileButton,
    sm: desktopButton,
  });

  if (!buttonComponent) return mobileButton;

  return buttonComponent;
};
