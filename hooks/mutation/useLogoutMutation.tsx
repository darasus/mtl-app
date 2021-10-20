import { signOut } from "next-auth/client";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { useFetcher } from "../useFetcher";

export const useLogoutMutation = (userId: number) => {
  const router = useRouter();
  const fetcher = useFetcher();

  return useMutation(
    async () => {
      await fetcher.invalidateUser(userId);
      return signOut();
    },
    {
      onSuccess() {
        router.push("/");
      },
    }
  );
};
