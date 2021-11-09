import { signOut } from "next-auth/client";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { withToast } from "../../utils/withToast";
import { useFetcher } from "../useFetcher";

export const useLogoutMutation = (userId: string) => {
  const router = useRouter();
  const fetcher = useFetcher();

  return useMutation(
    async () => {
      await withToast(fetcher.invalidateUser(userId), {
        success: "Logged out",
        loading: "Logging out...",
        error: "Error logging out",
      });
      await signOut();
    },
    {
      onSuccess() {
        router.push("/");
      },
    }
  );
};
