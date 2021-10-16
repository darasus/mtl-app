import { Flex, Box, Text, useBreakpointValue } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { Header } from "../components/Header";
import { useColors } from "../hooks/useColors";

type Props = {
  children: ReactNode;
};

export const Layout: React.FC<Props> = (props) => {
  const { secondaryTextColor } = useColors();
  const mainPadding = useBreakpointValue({
    base: "4",
    mr: "0",
  });

  return (
    <>
      <Flex
        flexDirection="column"
        width="100%"
        alignItems="center"
        pl={mainPadding}
        pr={mainPadding}
      >
        <Flex flexDirection="column" width="100%" maxWidth={960} flexShrink={0}>
          <Box paddingY="size-200" mb={6}>
            <Header />
          </Box>
          <Box marginBottom="size-200">{props.children}</Box>
          <Box my={5}>
            <Flex justifyContent="center">
              <Text
                color={secondaryTextColor}
              >{`${new Date().getFullYear()} © All rights reserved.`}</Text>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};
