import { Flex, Text, Box } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import { useMeQuery } from "../hooks/query/useMeQuery";

export const UserPreview = React.forwardRef<HTMLDivElement>(
  ({ ...props }, ref) => {
    const me = useMeQuery();

    if (!me.data) return null;

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
                src={me.data?.image as string}
                width="100"
                height="100"
                alt="Avatar"
              />
            </Box>
          </Box>
          <Text fontSize="sm" fontWeight="semibold">
            {me.data.name}
          </Text>
        </Flex>
      </div>
    );
  }
);
