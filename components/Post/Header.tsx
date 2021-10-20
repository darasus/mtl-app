import { useBreakpointValue } from "@chakra-ui/react";
import { Post as PostType } from "../../types/Post";
import React from "react";
import { MobileHeader } from "./MobileHeader";
import { DesktopHeader } from "./DesktopHeader";

interface Props {
  post: PostType;
  showMetaInfo?: boolean;
  isPostStatusVisible?: boolean;
}

export const Header: React.FC<Props> = ({
  post,
  showMetaInfo = true,
  isPostStatusVisible,
}) => {
  const header = useBreakpointValue({
    base: <MobileHeader post={post} />,
    md: (
      <DesktopHeader
        post={post}
        showMetaInfo={showMetaInfo}
        isPostStatusVisible={isPostStatusVisible}
      />
    ),
  });

  return header || null;
};
