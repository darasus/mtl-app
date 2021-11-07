import {
  Button,
  Flex,
  Center,
  Box,
  Input,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { Logo } from "../../components/Logo";
import { useSigninMutation } from "../../hooks/mutation/useSigninMutation";
import { supabase } from "../../lib/supabase";

interface FormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const router = useRouter();
  const signInMutation = useSigninMutation();
  const form = useForm<FormData>();

  const submit = form.handleSubmit((data) =>
    signInMutation.mutateAsync(data).then(async (res) => {
      console.log({ res });
      await supabase.auth.setSession(res.session.refresh_token);
      router.push("/");
    })
  );

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
                <Button isFullWidth onClick={() => router.push("/auth/signup")}>
                  Sign up
                </Button>
              </GridItem>
            </Grid>
          </form>
        </Box>
      </Flex>
    </Center>
  );
};

export default SignIn;
