import { Flex } from "@react-spectrum/layout";
import { Footer, View } from "@react-spectrum/view";
import React, { ReactNode } from "react";
import { Header } from "./Header";

type Props = {
  children: ReactNode;
};

export const Layout: React.FC<Props> = (props) => (
  <>
    <Flex direction="column" width="100%" alignItems="center">
      <Flex direction="column" width="100%" maxWidth={960} flexShrink={0}>
        <View paddingY="size-200">
          <Header />
        </View>
        <View marginBottom="size-200">{props.children}</View>
        <View>
          <Footer>&copy; All rights reserved.</Footer>
        </View>
      </Flex>
    </Flex>
    <style jsx global>{`
      html,
      body,
      #__next {
        width: 100%;
        height: 100%;
        margin: 0;
      }
    `}</style>
  </>
);
