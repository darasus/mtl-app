import { Flex, Box, Text } from "@chakra-ui/react";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const PreviewLayout: React.FC<Props> = (props) => (
  <>
    <Flex
      width="100vw"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Flex flexDirection="column" width="100%" maxWidth={960} flexShrink={0}>
        <Box marginBottom="size-200">{props.children}</Box>
      </Flex>
    </Flex>
  </>
);