import { Button, Flex, Center, Box } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import {
  ClientSafeProvider,
  getProviders,
  signIn,
  useSession,
} from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";
import { Logo } from "../../components/Logo";

interface Props {
  providers: Record<string, ClientSafeProvider>;
}

const SignIn: React.FC<Props> = ({ providers }) => {
  const [me] = useSession();
  const router = useRouter();
  const callbackUrl = router.query.callbackUrl as string | undefined;
  console.log(callbackUrl);

  React.useEffect(() => {
    if (me && callbackUrl) {
      router.push(callbackUrl ? callbackUrl : "/");
    }
  }, [me]);

  if (me) return null;

  return (
    <Center h="100vh">
      <Flex alignItems="center" direction="column">
        <Box mb={5}>
          <Logo />
        </Box>
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <Button variant="outline" onClick={() => signIn(provider.id)}>
              Sign in with {provider.name}
            </Button>
          </div>
        ))}
      </Flex>
    </Center>
  );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const providers = await getProviders();

  return {
    props: { providers },
  };
};
