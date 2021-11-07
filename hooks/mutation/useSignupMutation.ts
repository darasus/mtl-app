import { useMutation } from "react-query";
import { useFetcher } from "../useFetcher";

export const useSignupMutation = () => {
  const fetcher = useFetcher();
  return useMutation(
    (data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) => fetcher.signUp(data)
  );
};
