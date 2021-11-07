import { useMutation } from "react-query";
import { useFetcher } from "../useFetcher";

interface Variables {
  email: string;
  password: string;
}

export const useSigninMutation = () => {
  const fetcher = useFetcher();
  return useMutation(({ email, password }: Variables) =>
    fetcher.signIn({ email, password })
  );
};
