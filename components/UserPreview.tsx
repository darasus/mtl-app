import Prisma from ".prisma/client";
import { Flex } from "@react-spectrum/layout";
import { Text } from "@react-spectrum/text";
import { View } from "@react-spectrum/view";
import Image from "next/image";
import React from "react";
import { RouterLink } from "./RouterLinkt";

interface Props {
  user: Prisma.User;
}

export const UserPreview: React.FC<Props> = ({ user }) => {
  return (
    <RouterLink variant="secondary" href={`/u/${user?.id}`}>
      <Flex alignItems="center">
        <View marginEnd="size-100">
          <UserProfilePic user={user} />
        </View>
        <Text>{user?.name}</Text>
      </Flex>
    </RouterLink>
  );
};

export const UserProfilePic = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<Props>
>(({ user }, ref) => {
  return (
    <div ref={ref}>
      <View width={30} height={30} borderRadius="large" overflow="hidden">
        <Image
          src={user?.image as string}
          width="100"
          height="100"
          alt="Avatar"
        />
      </View>
    </div>
  );
});
