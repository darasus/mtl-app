import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserPreview } from "./UserPreview";
import {
  Button,
  Flex,
  Box,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useBreakpoint,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { PlusSmIcon, UserIcon, LogoutIcon } from "@heroicons/react/outline";
import { Logo } from "./Logo";
import { useLogoutMutation } from "../hooks/mutation/useLogoutMutation";
import { useMe } from "../hooks/useMe";
import { ActivityBadge } from "../components/ActivityBadge/ActivityBadge";

export const Header: React.FC = () => {
  const router = useRouter();
  const { me, isLoading } = useMe();
  const logout = useLogoutMutation(me?.id as number);
  const breakpoint = useBreakpoint();

  return (
    <Box py="6" cursor="pointer">
      <Flex alignItems="center">
        <Flex flexGrow={1}>
          <Link href="/" passHref>
            <ChakraLink display="block">
              <Logo />
            </ChakraLink>
          </Link>
          <Box ml={1} mt="2px">
            <Text color="brand" fontWeight="bold">
              Beta
            </Text>
          </Box>
        </Flex>
        {isLoading && <Spinner />}
        {me ? (
          <>
            {breakpoint !== "base" && (
              <Box mr={4}>
                <Link href="/p/create" passHref>
                  <Button
                    size="sm"
                    variant="cta"
                    // leftIcon={<PlusCircleIcon width="15" height="15" />}
                  >
                    Create
                  </Button>
                </Link>
              </Box>
            )}
            <Flex alignItems="center">
              <Menu>
                <MenuButton as={UserPreview} aria-label="Options" />
                <MenuList>
                  <MenuItem
                    icon={<UserIcon width="20" height="20" />}
                    onClick={() => router.push(`/u/${me?.id}`)}
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
                    onClick={() => logout.mutate()}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
              <Box mr={3} />
              <ActivityBadge />
            </Flex>
          </>
        ) : (
          router.pathname !== "/" &&
          !isLoading && (
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
