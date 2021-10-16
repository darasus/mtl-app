import { Button } from "@chakra-ui/button";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import { useRouter } from "next/router";
import React from "react";
import { slogan } from "../constants/slogan";

interface Props {
  withSignIn?: boolean;
}

export const Intro: React.FC<Props> = ({ withSignIn }) => {
  const router = useRouter();

  return (
    <Flex alignItems="center" direction="column">
      <Flex>
        <Heading size="3xl" mr={3}>
          This is
        </Heading>
        <Heading size="3xl" color="brand">
          My Tiny Library
        </Heading>
      </Flex>
      <Box mb={3} />
      <Heading size="xl">{slogan}</Heading>
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
