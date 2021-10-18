import { Button } from "@chakra-ui/button";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import { useBreakpointValue } from "@chakra-ui/media-query";
import { useRouter } from "next/router";
import React from "react";
import { slogan } from "../constants/slogan";

interface Props {
  withSignIn?: boolean;
}

export const Intro: React.FC<Props> = ({ withSignIn }) => {
  const router = useRouter();
  const headerSize = useBreakpointValue({
    base: "lg",
    sm: "3xl",
  });
  const textSize = useBreakpointValue({
    base: "md",
    sm: "xl",
  });

  return (
    <Flex alignItems="center" direction="column">
      <Flex whiteSpace="nowrap">
        <Heading size={headerSize} mr={3}>
          This is
        </Heading>
        <Heading size={headerSize} color="brand">
          My Tiny Library
        </Heading>
      </Flex>
      <Box mb={3} />
      <Heading size={textSize} textAlign="center">
        {slogan}
      </Heading>
      {withSignIn && (
        <Box mt={10}>
          <Button
            variant="outline"
            borderColor="brand"
            color="brand"
            onClick={() => router.push("/auth/signin")}
          >
            Sign in
          </Button>
        </Box>
      )}
    </Flex>
  );
};
