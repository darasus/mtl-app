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
import { User } from "../types/User";

export const Header: React.FC = () => {
  const router = useRouter();
  const me = useMeQuery();
  const [, isLoggedIn] = useSession();

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
        {isLoggedIn ? (
          <Flex>
            <Flex marginEnd="size-100">
              <UserPreview user={me.data as User} />
            </Flex>
            <Button
              marginEnd="size-100"
              variant="cta"
              onPress={() => router.push("/p/create")}
            >
              New post
            </Button>
            <Button variant="secondary" onPress={() => signOut()}>
              Log out
            </Button>
          </Flex>
        ) : (
          <Flex>
            <Button
              variant="cta"
              onPress={() => router.push("/api/auth/signin")}
            >
              Log in
            </Button>
          </Flex>
        )}
      </Flex>
    </View>
  );
};
