import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/client";
import { UserPreview } from "./UserPreview";
import { useMeQuery } from "../hooks/query/useMeQuery";
import {
  Button,
  Flex,
  Box,
  Link as ChakraLink,
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
import { Logo } from "./Logo";

export const Header: React.FC = () => {
  const router = useRouter();
  const me = useMeQuery();

  return (
    <Box py="6" cursor="pointer">
      <Flex alignItems="center">
        <Flex flexGrow={1}>
          <Link href="/" passHref>
            <ChakraLink display="block">
              <Logo />
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
          router.pathname !== "/" && (
            <Flex>
              <Button
                variant="outline"
                onClick={() => router.push("/auth/signin")}
                borderColor="brand"
                color="brand"
              >
                Sign in
              </Button>
            </Flex>
          )
        )}
      </Flex>
    </Box>
  );
};
