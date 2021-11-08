import { GetServerSideProps } from "next";
import { getCsrfToken } from "next-auth/client";
import React from "react";
import { AuthForm } from "../../features/AuthForm";

interface Props {
  csrfToken: string | undefined;
}

const SignUp: React.FC<Props> = ({ csrfToken }) => {
  return <AuthForm csrfToken={csrfToken} type="signup" />;
};

export default SignUp;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const csrfToken = await getCsrfToken(ctx);

  return {
    props: { csrfToken },
  };
};
