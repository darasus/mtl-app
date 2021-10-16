import { Box, Flex, Heading } from "@chakra-ui/layout";
import { slogan } from "../constants/slogan";

export const Intro = () => {
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
    </Flex>
  );
};
