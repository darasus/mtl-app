import Prisma from ".prisma/client";
import { Flex, Text, Box } from "@chakra-ui/react";
import React from "react";
import { RouterLink } from "./RouterLinkt";
import { UserProfilePic } from "./UserProfilePic";

interface Props {
  user: Prisma.User;
}

export const PostUserPreview: React.FC<Props> = ({ user }) => {
  return (
    <RouterLink variant="secondary" href={`/u/${user?.id}`}>
      <Flex alignItems="center">
        <Box mr={1}>
          <UserProfilePic user={user} />
        </Box>
        <Text fontSize="sm">{user?.name}</Text>
      </Flex>
    </RouterLink>
  );
};
