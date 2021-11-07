import { useMutation } from "react-query";
import { supabase } from "../../lib/supabase";

interface Variables {
  email: string;
  password: string;
}

export const useSigninMutation = () => {
  return useMutation(({ email, password }: Variables) =>
    supabase.auth.signIn({ email, password })
  );
};
