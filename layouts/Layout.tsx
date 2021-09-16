import { Flex, Box, Text } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { Header } from "../components/Header";

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
        <Box my={5}>
          <Flex justifyContent="center">
            <Text color="gray.500">{`${new Date().getFullYear()} © All rights reserved.`}</Text>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  </>
);
