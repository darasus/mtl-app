import Prisma from ".prisma/client";
import { Flex, Text, Box } from "@chakra-ui/react";
import React from "react";
import { useMeQuery } from "../hooks/useMeQuery";
import { RouterLink } from "./RouterLinkt";
import { UserProfilePic } from "./UserProfilePic";

export const UserPreview = React.forwardRef<HTMLDivElement>(
  ({ ...props }, ref) => {
    const me = useMeQuery();

    if (!me.data) return null;

    return (
      <div {...props}>
        <Flex ref={ref} alignItems="center">
          <Box mr={2}>
            <UserProfilePic user={me.data} />
          </Box>
          <Text fontSize="sm" fontWeight="semibold">
            {me.data.name}
          </Text>
        </Flex>
      </div>
    );
  }
);
