import Prisma from ".prisma/client";
import { Flex } from "@react-spectrum/layout";
import { Text } from "@react-spectrum/text";
import { View } from "@react-spectrum/view";
import { Link as SPLink } from "@react-spectrum/link";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  user: Prisma.User;
}

export const UserPreview: React.FC<Props> = ({ user }) => {
  return (
    <Link as={`/u/${user.id}`} href="/u/[id]">
      <SPLink variant="secondary">
        <a>
          <Flex alignItems="center">
            <View
              width={30}
              height={30}
              borderRadius="large"
              overflow="hidden"
              marginEnd="size-100"
            >
              <Image src={user.image} width="100" height="100" alt="Avatar" />
            </View>
            <Text>{user.name}</Text>
          </Flex>
        </a>
      </SPLink>
    </Link>
  );
};
