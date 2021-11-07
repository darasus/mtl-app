import {
  Button,
  Flex,
  Center,
  Box,
  Input,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { Logo } from "../../components/Logo";
import { useSigninMutation } from "../../hooks/mutation/useSigninMutation";

interface FormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const router = useRouter();
  const signInMutation = useSigninMutation();
  const form = useForm<FormData>();

  React.useEffect(() => {
    if (signInMutation.isSuccess) {
      router.push("/");
    }
  }, [signInMutation.isSuccess, router]);

  const submit = form.handleSubmit((data) => signInMutation.mutateAsync(data));

  return (
    <Center h="100vh">
      <Flex alignItems="center" direction="column">
        <Box mb={5}>
          <Logo />
        </Box>
        <Box width="300px">
          <form onSubmit={submit}>
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={12}>
                <Input
                  {...form.register("email")}
                  placeholder="Email"
                  type="email"
                />
              </GridItem>
              <GridItem colSpan={12}>
                <Input
                  {...form.register("password")}
                  placeholder="Password"
                  type="password"
                />
              </GridItem>
              {signInMutation.error && (
                <GridItem colSpan={12}>
                  <Text color="red.500">{signInMutation.error as string}</Text>
                </GridItem>
              )}
              <GridItem colSpan={12}>
                <Button
                  isFullWidth
                  type="submit"
                  isLoading={signInMutation.isLoading}
                >
                  Sign in
                </Button>
              </GridItem>
              <GridItem colSpan={12}>
                <Flex justifyContent="center">
                  <Text color="gray.500" mr={1} fontSize="sm">
                    or
                  </Text>
                  <Button
                    variant="link"
                    onClick={() => router.push("/auth/signup")}
                    size="sm"
                  >
                    Sign up
                  </Button>
                </Flex>
              </GridItem>
            </Grid>
          </form>
        </Box>
      </Flex>
    </Center>
  );
};

export default SignIn;
