import { signOut } from "next-auth/client";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { invalidateUser } from "../../request/invalidateUser";

export const useLogoutMutation = (userId: number) => {
  const router = useRouter();

  return useMutation(
    async () => {
      await invalidateUser(userId);
      return signOut();
    },
    {
      onSuccess() {
        router.push("/");
      },
    }
  );
};
