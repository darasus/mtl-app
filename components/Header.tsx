import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/client";
import Image from "next/image";
import { UserPreview } from "./UserPreview";
import { useMeQuery } from "../hooks/useMeQuery";
import { Button, Flex, Box } from "rebass";

export const Header: React.FC = () => {
  const router = useRouter();
  const me = useMeQuery();

  return (
    <Box>
      <Flex alignItems="center">
        <Flex flexGrow={1}>
          <Link href="/">
            <a>
              <Image src="/logo.svg" height="31" width={200} />
            </a>
          </Link>
        </Flex>
        {me.data ? (
          <Flex>
            <Flex sx={{ marginRight: 2 }}>
              <UserPreview user={me.data} />
            </Flex>
            <Button
              sx={{
                marginRight: 2,
              }}
              onClick={() => router.push("/p/create")}
            >
              New post
            </Button>
            <Button variant="secondary" onClick={() => signOut()}>
              Log out
            </Button>
          </Flex>
        ) : (
          <Flex>
            <Button
              variant="cta"
              onClick={() => router.push("/api/auth/signin")}
            >
              Log in
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};
