import { CodeLanguage } from ".prisma/client";
import { Flex, Text } from "@chakra-ui/layout";
import React from "react";

interface Props {
  codeLanguage: CodeLanguage;
  width?: number;
  height?: number;
  fontSize?: React.ComponentProps<typeof Text>["fontSize"];
}

const colorMap = {
  [CodeLanguage.JAVASCRIPT]: "#f7e018",
  [CodeLanguage.TYPESCRIPT]: "#3178c6",
};

const labelMap = {
  [CodeLanguage.JAVASCRIPT]: "js",
  [CodeLanguage.TYPESCRIPT]: "ts",
};

const textColorMap = {
  [CodeLanguage.JAVASCRIPT]: "black",
  [CodeLanguage.TYPESCRIPT]: "white",
};

export const CodeLanguageIcon: React.FC<Props> = ({
  codeLanguage,
  width = 8,
  height = 8,
  fontSize = "xs",
}) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      width={width}
      height={height}
      backgroundColor={colorMap[codeLanguage]}
      color={textColorMap[codeLanguage]}
      borderRadius={1000}
      pl={"2px"}
    >
      <Text fontSize={fontSize} fontWeight="bold" textAlign="center">
        {labelMap[codeLanguage]}
      </Text>
    </Flex>
  );
};
