import {
  Button,
  Flex,
  Center,
  Box,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { SignUp } from "@clerk/nextjs";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { Logo } from "../../components/Logo";

const BrandLogo = ({ name }: { name: string }) => {
  const { colorMode } = useColorMode();

  return (
    <Image
      src={
        colorMode === "dark"
          ? `/${name}-logo-light.svg`
          : `/${name}-logo-dark.svg`
      }
      height={23}
      width={23}
      alt={name}
    />
  );
};

const SignIn = () => {
  const router = useRouter();
  const callbackUrl = router.query.callbackUrl as string | undefined;

  // React.useEffect(() => {
  //   if (me) {
  //     router.push(callbackUrl ? callbackUrl : "/");
  //   }
  // }, [me, callbackUrl, router]);

  // if (me) return null;

  return (
    <Center h="100vh">
      <Flex alignItems="center" direction="column">
        <SignUp />
      </Flex>
    </Center>
  );
};

export default SignIn;
