import { CodeLanguage } from ".prisma/client";
import { Box, Flex, Text } from "@chakra-ui/layout";
import React from "react";

interface Props {
  codeLanguage: CodeLanguage;
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

export const CodeLanguageIcon: React.FC<Props> = ({ codeLanguage }) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      width={"20px"}
      height={"20px"}
      backgroundColor={colorMap[codeLanguage]}
      color={textColorMap[codeLanguage]}
      borderRadius={1000}
      pl={"2px"}
    >
      <Text fontSize="xs" fontWeight="bold" textAlign="center">
        {labelMap[codeLanguage]}
      </Text>
    </Flex>
  );
};
