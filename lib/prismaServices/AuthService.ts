import prisma from "../prisma";
import { supabase } from "../supabase";
import { UserCredentials } from "@supabase/gotrue-js";

export class AuthService {
  async signUp(
    props: UserCredentials,
    options: {
      redirectTo?: string;
      data?: object;
    }
  ) {
    const response = await supabase.auth.signUp(props, options);
    const { user } = response;

    if (!user) return null;

    await prisma.user.create({
      data: {
        id: user.id,
        name: `${user.user_metadata.first_name} ${user.user_metadata.last_name}`,
        firstName: user.user_metadata.first_name,
        lastName: user.user_metadata.last_name,
        image: undefined,
        createdAt: user.created_at,
        updatedAt: user.created_at,
        email: user.email as string,
      },
    });

    return response;
  }

  async signIn({ email, password }: { email: string; password: string }) {
    const response = await supabase.auth.signIn({ email, password });
    return response;
  }
}
