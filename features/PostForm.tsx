import React from "react";
import * as yup from "yup";
import {
  Textarea,
  Input,
  Heading,
  Box,
  Button,
  Flex,
  Text,
  Select,
} from "@chakra-ui/react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { CodeLanguage } from ".prisma/client";
import { useColors } from "../hooks/useColors";
import { CodeEditor } from "../components/CodeEditor";
import { useTagsQuery } from "../hooks/query/useTagsQuery";
import { ArrowCircleUpIcon } from "@heroicons/react/outline";

interface Props {
  submit: React.FormEventHandler;
  isSubmitting: boolean;
}

export interface PostForm {
  title: string;
  description: string;
  content: string;
  codeLanguage: CodeLanguage;
  tagId: number | null;
}

export const postSchema = yup.object().shape({
  title: yup.string().required("Please fill in your title here"),
  description: yup.string(),
  content: yup.string().min(3).required("Please write your library here"),
  codeLanguage: yup
    .string()
    .test(
      "has-code-language",
      "Please select language",
      (value) => !!value && value !== "none"
    )
    .typeError("Please select tag")
    .required("Please select tag"),
  tagId: yup
    .number()
    .test("has-tag", "Please select tag", (value) => !!value && value > 0)
    .typeError("Please select tag")
    .required("Please select tag"),
});

const FormItem: React.FC<{ title: string; errorMessage?: string }> = ({
  title,
  errorMessage,
  children,
}) => {
  const { secondaryTextColor } = useColors();
  return (
    <Flex flexDirection="column" mb={6}>
      <Flex>
        <Text color={secondaryTextColor} mb={2}>
          {title}
        </Text>
        <Box mr={2} />
        {errorMessage && (
          <Text color="red.300" mb={2}>
            {errorMessage}
          </Text>
        )}
      </Flex>
      {children}
    </Flex>
  );
};

export const PostForm: React.FC<Props> = ({ submit, isSubmitting }) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<PostForm>();
  const tags = useTagsQuery();
  const codeLanguage = useWatch({ control, name: "codeLanguage" });

  return (
    <Box>
      <form onSubmit={submit}>
        <Heading mb={10} variant="section-heading">
          Create new javascript library
        </Heading>
        <FormItem title="Title" errorMessage={errors.title?.message}>
          <Input {...register("title")} isInvalid={!!errors.title?.message} />
        </FormItem>
        <FormItem
          title="Description"
          errorMessage={errors.description?.message}
        >
          <Textarea
            {...register("description")}
            isInvalid={!!errors.description?.message}
          />
        </FormItem>
        <FormItem title="Language" errorMessage={errors.codeLanguage?.message}>
          <Select
            {...register("codeLanguage")}
            isInvalid={!!errors.codeLanguage?.message}
          >
            <option key={"none"} value="none">
              -
            </option>
            <option value={CodeLanguage.JAVASCRIPT}>JavaScript</option>
            <option value={CodeLanguage.TYPESCRIPT}>TypeScript</option>
          </Select>
        </FormItem>
        <FormItem title="Tag" errorMessage={errors.tagId?.message}>
          <Select {...register("tagId")} isInvalid={!!errors.tagId?.message}>
            <option key={0} value={0}>
              -
            </option>
            {tags.data?.map((tag) => {
              return (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              );
            })}
          </Select>
        </FormItem>

        <FormItem
          title={`Tiny ${codeLanguage?.toLowerCase()} library`}
          errorMessage={errors.content?.message}
        >
          <Controller
            name="content"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CodeEditor
                value={value}
                onChange={onChange}
                codeLanguage={codeLanguage}
                isInvalid={!!errors.content?.message}
              />
            )}
          />
        </FormItem>

        <Flex>
          <Button
            type="submit"
            marginRight="size-200"
            disabled={isSubmitting}
            variant="outline"
            isLoading={isSubmitting}
            loadingText="Publish"
            mr={2}
            color="brand"
            borderColor="brand"
            leftIcon={<ArrowCircleUpIcon width="20px" height="20px" />}
          >
            Publish
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
