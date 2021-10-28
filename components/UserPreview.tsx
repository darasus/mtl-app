import { Flex, Text, Box } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import { useMe } from "../hooks/useMe";

export const UserPreview = React.forwardRef<HTMLDivElement>(
  function UserPreview({ ...props }, ref) {
    const { me } = useMe();

    if (!me) return null;

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
                src={me?.image as string}
                width="100"
                height="100"
                alt="Avatar"
              />
            </Box>
          </Box>
          <Text fontSize="sm" fontWeight="semibold">
            {me?.name}
          </Text>
        </Flex>
      </div>
    );
  }
);
