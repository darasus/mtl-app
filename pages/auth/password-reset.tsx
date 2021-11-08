import { Button } from "@chakra-ui/button";
import { FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Center, Flex, Text } from "@chakra-ui/layout";
import { BanIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { usePasswordResetMutation } from "../../hooks/mutation/usePasswordResetMutation";

const PasswordResetPage = () => {
  const router = useRouter();
  const passwordResetMutation = usePasswordResetMutation();
  const form = useForm();

  const handleClick = form.handleSubmit((data) => {
    passwordResetMutation.mutateAsync({ email: data.email });
  });

  React.useEffect(() => {
    if (passwordResetMutation.isSuccess) {
      router.push("/auth/signin");
    }
  }, [passwordResetMutation.isSuccess, router]);

  return (
    <Center h="100vh">
      <Flex flexDirection="column" justifyContent="center" maxW="300px">
        <FormLabel>Email address</FormLabel>
        <Input {...form.register("email")} />
        <Box mb={4} />
        <Button
          onClick={handleClick}
          isLoading={passwordResetMutation.isLoading}
        >
          Reset password
        </Button>
      </Flex>
    </Center>
  );
};

export default PasswordResetPage;
