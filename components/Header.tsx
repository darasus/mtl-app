import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/client";
import Image from "next/image";
import { UserPreview } from "./UserPreview";
import { useMeQuery } from "../hooks/useMeQuery";
import { Flex } from "@react-spectrum/layout";
import { Button } from "@react-spectrum/button";
import { View } from "@react-spectrum/view";

export const Header: React.FC = () => {
  const router = useRouter();
  const { data: me } = useMeQuery();

  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  return (
    <View>
      <Flex alignItems="center">
        <Flex flexGrow={1}>
          <Link href="/">
            <a>
              <Image src="/logo.svg" height="31" width={200} />
            </a>
          </Link>
        </Flex>
        {!me && (
          <Flex>
            <Button
              variant="primary"
              onPress={() => router.push("/api/auth/signin")}
            >
              Log in
            </Button>
          </Flex>
        )}
        {me && (
          <Flex>
            <Flex marginEnd="size-100">
              <UserPreview user={me} />
            </Flex>
            <Button
              marginEnd="size-100"
              variant="cta"
              onPress={() => router.push("/create-post")}
            >
              New post
            </Button>
            <Button variant="secondary" onPress={() => signOut()}>
              Log out
            </Button>
          </Flex>
        )}
      </Flex>
    </View>
  );
};
