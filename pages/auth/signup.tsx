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
import { useSignupMutation } from "../../hooks/mutation/useSignupMutation";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const router = useRouter();
  const [signedUp, setSignedUp] = React.useState<boolean>(false);
  const signUpMutation = useSignupMutation();
  const form = useForm<FormData>();

  const submit = form.handleSubmit((data) =>
    signUpMutation.mutateAsync(data).then(() => {
      setSignedUp(true);
    })
  );

  return (
    <Center h="100vh">
      <Flex alignItems="center" direction="column">
        <Box mb={5}>
          <Logo />
        </Box>
        <Box width="300px">
          {signedUp ? (
            <Text textAlign="center">{`You account is created! Please confirm your email address.`}</Text>
          ) : (
            <form onSubmit={submit}>
              <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                <GridItem colSpan={6}>
                  <Input
                    {...form.register("firstName")}
                    placeholder="First name"
                  />
                </GridItem>
                <GridItem colSpan={6}>
                  <Input
                    {...form.register("lastName")}
                    placeholder="Last name"
                  />
                </GridItem>
                <GridItem colSpan={12}>
                  <Input {...form.register("email")} placeholder="Email" />
                </GridItem>
                <GridItem colSpan={12}>
                  <Input
                    {...form.register("password")}
                    placeholder="Password"
                    type="password"
                  />
                </GridItem>
                <GridItem colSpan={12}>
                  <Button
                    isFullWidth
                    type="submit"
                    isLoading={signUpMutation.isLoading}
                  >
                    Sign up
                  </Button>
                </GridItem>
                <GridItem colSpan={12}>
                  <Flex justifyContent="center">
                    <Text color="gray.500" mr={1} fontSize="sm">
                      or
                    </Text>
                    <Button
                      variant="link"
                      onClick={() => router.push("/auth/signin")}
                      size="sm"
                    >
                      Sign in
                    </Button>
                  </Flex>
                </GridItem>
              </Grid>
            </form>
          )}
        </Box>
      </Flex>
    </Center>
  );
};

export default SignIn;
