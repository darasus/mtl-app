import { useMutation } from "react-query";
import { withToast } from "../../utils/withToast";
import { useFetcher } from "../useFetcher";

interface Variables {
  email: string;
}

export const usePasswordResetMutation = () => {
  const fetcher = useFetcher();
  return useMutation(({ email }: Variables) =>
    withToast(fetcher.resetPassword(email), {
      loading: "Resetting password...",
      success: "Password reset email sent!",
      error: "Error resetting password",
    })
  );
};
