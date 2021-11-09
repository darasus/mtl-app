import { Button } from "@chakra-ui/button";
import { FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Center, Flex } from "@chakra-ui/layout";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { FormItem } from "../../features/PostForm";
import { usePasswordResetMutation } from "../../hooks/mutation/usePasswordResetMutation";
import { yup } from "../../lib/yup";

export const scheme = yup.object().shape({
  email: yup.string().required("Please fill in your email"),
});

const PasswordResetPage = () => {
  const router = useRouter();
  const passwordResetMutation = usePasswordResetMutation();
  const form = useForm({
    resolver: yupResolver(scheme),
  });

  const submit = form.handleSubmit((data) => {
    passwordResetMutation.mutateAsync({ email: data.email });
  });

  React.useEffect(() => {
    if (passwordResetMutation.isSuccess) {
      router.push("/auth/signin");
    }
  }, [passwordResetMutation.isSuccess, router]);

  return (
    <form onSubmit={submit}>
      <Center h="100vh">
        <Flex
          flexDirection="column"
          justifyContent="center"
          width="100%"
          maxW="300px"
        >
          <FormItem
            title="Email address"
            errorMessage={form.formState.errors.email?.message}
          >
            <Input {...form.register("email")} />
          </FormItem>
          <Button type="submit" isLoading={passwordResetMutation.isLoading}>
            Reset password
          </Button>
        </Flex>
      </Center>
    </form>
  );
};

export default PasswordResetPage;
