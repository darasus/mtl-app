import { Flex, Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { Header } from "./Header";

type Props = {
  children: ReactNode;
};

export const Layout: React.FC<Props> = (props) => (
  <>
    <Flex flexDirection="column" width="100%" alignItems="center">
      <Flex flexDirection="column" width="100%" maxWidth={960} flexShrink={0}>
        <Box paddingY="size-200">
          <Header />
        </Box>
        <Box marginBottom="size-200">{props.children}</Box>
        <Box>
          <Box>&copy; All rights reserved.</Box>
        </Box>
      </Flex>
    </Flex>
    <style jsx global>{`
      html,
      body,
      #__next {
        width: 100%;
        height: 100%;
        margin: 0;
      }
    `}</style>
  </>
);
