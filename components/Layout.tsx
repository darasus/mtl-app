import React, { ReactNode } from "react";
import { Header } from "./Header";

type Props = {
  children: ReactNode;
};

export const Layout: React.FC<Props> = (props) => (
  <div className="max-w-4xl mx-auto">
    <Header />
    <div>{props.children}</div>
  </div>
);
