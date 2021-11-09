import { Button } from "@chakra-ui/button";
import { Box, Center, Flex, Text } from "@chakra-ui/layout";
import { BanIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

const Error = () => {
  const router = useRouter();

  return (
    <Center h="100vh">
      <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        maxW="300px"
      >
        <Box mb={2}>
          <Text color="red.500">
            <BanIcon width="50px" height="50px" />
          </Text>
        </Box>
        <Text textAlign="center">
          {router.query?.error || `Something went wrong, please try again`}
        </Text>
        <Box mb={4} />
        <Button onClick={() => router.back()}>Go back</Button>
      </Flex>
    </Center>
  );
};

export default Error;
