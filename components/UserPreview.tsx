import { Flex, Text, Box } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

export const UserPreview = React.forwardRef<HTMLDivElement>(
  function UserPreview({ ...props }, ref) {
    const user = useUser();

    return (
      <div {...props}>
        <Flex ref={ref} alignItems="center">
          <Box mr={2}>
            <Box
              width={7}
              height={7}
              borderRadius={100}
              overflow="hidden"
              boxShadow="base"
            >
              <Image
                src={user.profileImageUrl as string}
                width="100"
                height="100"
                alt="Avatar"
                quality={100}
              />
            </Box>
          </Box>
          <Text
            fontSize="sm"
            fontWeight="semibold"
            data-testid="user-preview-name"
          >
            {user.fullName}
          </Text>
        </Flex>
      </div>
    );
  }
);
