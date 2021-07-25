import Prisma from ".prisma/client";
import { Flex, Text, Box } from "rebass";
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
        <Box sx={{ marginRight: 2 }}>
          <UserProfilePic user={user} />
        </Box>
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
      <Box width={30} height={30} sx={{ borderRadius: 100 }} overflow="hidden">
        <Image
          src={user?.image as string}
          width="100"
          height="100"
          alt="Avatar"
        />
      </Box>
    </div>
  );
});
