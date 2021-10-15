import { signOut } from "next-auth/client";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { Fetcher } from "../../lib/Fetcher";

export const useLogoutMutation = (userId: number) => {
  const router = useRouter();
  const fetcher = new Fetcher();

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
