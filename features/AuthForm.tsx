import {
  Button,
  Flex,
  Center,
  Box,
  Text,
  useColorMode,
  Input,
  Grid,
  GridItem,
  Divider,
  Link as ChakraLink,
  FormLabel,
} from "@chakra-ui/react";
import { signIn } from "next-auth/client";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";
import { useColors } from "../hooks/useColors";
import { Logo } from "../components/Logo";
import { useMe } from "../hooks/useMe";

interface Props {
  csrfToken: string | undefined;
  type: "signin" | "signup";
}

const BrandLogo = ({ name }: { name: "github" }) => {
  const { colorMode } = useColorMode();

  return (
    <Image
      src={
        colorMode === "dark"
          ? `/${name}-logo-light.svg`
          : `/${name}-logo-dark.svg`
      }
      height={18}
      width={18}
      alt={name}
    />
  );
};

export const AuthForm: React.FC<Props> = ({ csrfToken, type }) => {
  const { borderColor } = useColors();
  const { me } = useMe();
  const router = useRouter();
  const callbackUrl = router.query.callbackUrl as string | undefined;

  const title = {
    ["signin"]: "Sign in to your account",
    ["signup"]: "Create your account",
  };

  const subTitleText = {
    ["signin"]: (
      <Text fontSize="sm">
        Or{" "}
        <Link href="/auth/signup" passHref>
          <ChakraLink textDecor="underline">you can register here</ChakraLink>
        </Link>
      </Text>
    ),
    ["signup"]: (
      <Text fontSize="sm">
        If you already have and account{" "}
        <Link href="/auth/signin" passHref>
          <ChakraLink textDecor="underline">go to login</ChakraLink>
        </Link>
      </Text>
    ),
  };

  const buttonText = {
    ["signin"]: "Sign in",
    ["signup"]: "Sign up",
  };

  React.useEffect(() => {
    if (me) {
      router.push(callbackUrl ? callbackUrl : "/");
    }
  }, [me, callbackUrl, router]);

  if (me) return null;

  return (
    <Center h="100vh">
      <Flex alignItems="center" direction="column">
        <Box textAlign="center" mb={4}>
          <Box>
            <Link href="/" passHref>
              <a>
                <Logo />
              </a>
            </Link>
          </Box>
          <Text fontSize="3xl" fontWeight="bold">
            {title[type]}
          </Text>
          {subTitleText[type]}
        </Box>
        <Box
          width="300px"
          borderColor={borderColor}
          p={4}
          borderRadius="lg"
          borderWidth="thin"
        >
          <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={12}>
              <form method="post" action="/api/auth/callback/credentials">
                <input
                  name="csrfToken"
                  type="hidden"
                  defaultValue={csrfToken}
                />
                {type === "signup" && (
                  <>
                    <FormLabel>First name</FormLabel>
                    <Input type="text" id="firstName" name="firstName" />
                    <Box mb={4} />
                    <FormLabel>Last name</FormLabel>
                    <Input type="text" id="lastName" name="lastName" />
                    <Box mb={4} />
                  </>
                )}
                <FormLabel>Email address</FormLabel>
                <Input type="email" id="email" name="email" />
                <Box mb={4} />
                <FormLabel>Password</FormLabel>
                <Input type="password" id="password" name="password" />
                <Button
                  variant="link"
                  onClick={() => router.push("/auth/password-reset")}
                  size="xs"
                  textDecoration="underline"
                  color="gray.700"
                >
                  Forgot password?
                </Button>
                <Box mb={4} />
                <Button type="submit" isFullWidth>
                  {buttonText[type]}
                </Button>
              </form>
            </GridItem>
            <GridItem colSpan={12} my={2}>
              <Box position="relative">
                <Box
                  position="absolute"
                  top={"-11px"}
                  left={0}
                  right={0}
                  margin="0 auto"
                  width="130px"
                  textAlign="center"
                  background="black"
                  px={1}
                  zIndex={1}
                >
                  <Text fontSize="sm">Or continue with</Text>
                </Box>
                <Divider width="100%" />
              </Box>
            </GridItem>
            <GridItem colSpan={12}>
              <Button
                onClick={() => signIn("github")}
                data-testid="github-signin-button"
                isFullWidth
              >
                <Flex alignItems="center">
                  <Text mr={2}>GitHub</Text>
                  <BrandLogo name={"github"} />
                </Flex>
              </Button>
            </GridItem>
          </Grid>
        </Box>
      </Flex>
    </Center>
  );
};
