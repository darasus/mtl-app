import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/client";
import Image from "next/image";
import { UserPreview } from "./UserPreview";
import { useMeQuery } from "../hooks/query/useMeQuery";
import {
  Button,
  Flex,
  Box,
  Link as ChakraLink,
  useColorMode,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import {
  PlusSmIcon,
  UserIcon,
  PlusCircleIcon,
  LogoutIcon,
} from "@heroicons/react/outline";

export const Header: React.FC = () => {
  const router = useRouter();
  const me = useMeQuery();
  const { colorMode } = useColorMode();

  return (
    <Box py="6" cursor="pointer">
      <Flex alignItems="center">
        <Flex flexGrow={1}>
          <Link href="/" passHref>
            <ChakraLink display="block">
              <Image
                src={
                  colorMode === "dark" ? "/logo-light.svg" : "/logo-dark.svg"
                }
                height="30"
                width={130}
              />
            </ChakraLink>
          </Link>
        </Flex>
        {me.data ? (
          <>
            <Box mr={4}>
              <Link href="/p/create">
                <Button
                  size="sm"
                  variant="outline"
                  color="brand"
                  borderColor="brand"
                  leftIcon={<PlusCircleIcon width="15" height="15" />}
                >
                  Create
                </Button>
              </Link>
            </Box>
            <Flex alignItems="center">
              <Menu>
                <MenuButton as={UserPreview} aria-label="Options" />
                <MenuList>
                  <MenuItem
                    icon={<UserIcon width="20" height="20" />}
                    onClick={() => router.push(`/u/${me.data?.id}`)}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    icon={<PlusSmIcon width="20" height="20" />}
                    onClick={() => router.push("/p/create")}
                  >
                    New post
                  </MenuItem>
                  <MenuItem
                    color="red.500"
                    icon={<LogoutIcon width="20" height="20" />}
                    onClick={() => signOut()}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </>
        ) : (
          <Flex>
            <Button
              variant="cta"
              onClick={() => router.push("/api/auth/signin")}
            >
              Log in
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};
