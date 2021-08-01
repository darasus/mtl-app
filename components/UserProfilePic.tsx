import { Box } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import { User } from "../types/User";

interface Props {
  user: User;
}

export const UserProfilePic: React.FC<Props> = ({ user }) => {
  return (
    <Box
      width={7}
      height={7}
      borderRadius={100}
      overflow="hidden"
      boxShadow="base"
    >
      <Image
        src={user?.image as string}
        width="100"
        height="100"
        alt="Avatar"
      />
    </Box>
  );
};
