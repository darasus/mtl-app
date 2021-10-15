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
  title: yup.string().min(3).max(100).required(),
  description: yup.string().min(3).max(1000).required(),
  content: yup.string().min(3).max(1000).required(),
  codeLanguage: yup
    .string()
    .typeError("Please select tag")
    .required("Please select tag"),
  tagId: yup
    .number()
    .typeError("Please select tag")
    .required("Please select tag"),
});

export const PostForm: React.FC<Props> = ({ submit, isSubmitting }) => {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<PostForm>();
  const tags = useTagsQuery();
  const { secondaryTextColor } = useColors();
  const codeLanguage = useWatch({ control, name: "codeLanguage" });

  return (
    <Box>
      <form onSubmit={submit}>
        <Heading mb={10} variant="section-heading">
          Create new javascript library
        </Heading>
        <Box mb={3}>
          <Text mr={1} color={secondaryTextColor} mb={2}>
            Title
          </Text>
          <Box />
          {errors.title?.message && (
            <Text color="red.500" mb={2}>
              {errors.title?.message}
            </Text>
          )}
          <Input {...register("title")} isInvalid={!!errors.title?.message} />
        </Box>
        <Box mb={3}>
          <Flex>
            <Text color={secondaryTextColor} mb={2}>
              Description
            </Text>
            {errors.description?.message && (
              <Text color="red.500" mb={2}>
                {errors.description?.message}
              </Text>
            )}
          </Flex>
          <Textarea
            {...register("description")}
            isInvalid={!!errors.description?.message}
          />
        </Box>
        <Box mb={3}>
          <Flex>
            <Text color={secondaryTextColor} mb={2}>
              Language
            </Text>
            {errors.codeLanguage?.message && (
              <Text color="red.500" mb={2}>
                {errors.codeLanguage?.message}
              </Text>
            )}
          </Flex>
          <Select
            {...register("codeLanguage")}
            isInvalid={!!errors.codeLanguage?.message}
          >
            <option value={CodeLanguage.JAVASCRIPT}>JavaScript</option>
            <option value={CodeLanguage.TYPESCRIPT}>TypeScript</option>
          </Select>
        </Box>
        <Box mb={3}>
          <Flex>
            <Text color={secondaryTextColor} mb={2}>
              Tag
            </Text>
            {errors.tagId?.message && (
              <Text color="red.500" mb={2}>
                {errors.tagId?.message}
              </Text>
            )}
          </Flex>
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
        </Box>
        <Box mb={3}>
          <Text color={secondaryTextColor} mb={2}>
            {`Tiny ${codeLanguage?.toLowerCase()} library`}
          </Text>
          {errors.content?.message && (
            <Text color="red.500" mb={2}>
              {errors.content?.message}
            </Text>
          )}
          <Controller
            name="content"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CodeEditor
                value={value}
                onChange={onChange}
                codeLanguage={codeLanguage}
              />
            )}
          />
        </Box>
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
