import { GetServerSideProps } from "next";
import { getCsrfToken } from "next-auth/client";
import React from "react";
import { AuthForm } from "../../features/AuthForm";

interface Props {
  csrfToken: string | undefined;
}

const SignIn: React.FC<Props> = ({ csrfToken }) => {
  return <AuthForm csrfToken={csrfToken} type="signin" />;
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const csrfToken = await getCsrfToken(ctx);

  return {
    props: { csrfToken },
  };
};
