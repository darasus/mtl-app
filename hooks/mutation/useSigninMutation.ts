import { useMutation } from "react-query";
import { supabase } from "../../lib/supabase";

interface Variables {
  email: string;
  password: string;
}

export const useSigninMutation = () => {
  return useMutation(async ({ email, password }: Variables) => {
    const { data, error } = await supabase.auth.signIn({ email, password });
    if (error) {
      throw error.message;
    }

    return data;
  });
};
