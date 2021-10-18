import { useBreakpointValue } from "@chakra-ui/react";
import { Post as PostType } from "../../types/Post";
import React from "react";
import { MobileHeader } from "./MobileHeader";
import { DesktopHeader } from "./DesktopHeader";

interface Props {
  post: PostType;
  showMetaInfo?: boolean;
}

export const Header: React.FC<Props> = ({ post, showMetaInfo = true }) => {
  const header = useBreakpointValue({
    base: <MobileHeader post={post} />,
    md: <DesktopHeader post={post} showMetaInfo={showMetaInfo} />,
  });

  return header || null;
};
