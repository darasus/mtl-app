import { Button } from "@chakra-ui/button";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/layout";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { Head } from "../components/Head";
import { Heading } from "../components/Heading";
import { useUpdateUserSettingsMutation } from "../hooks/mutation/useUpdateUserSettingsMutation";
import { useUploadImageMutation } from "../hooks/mutation/useUploadImageMutation";
import { useMe } from "../hooks/useMe";
import { Layout } from "../layouts/Layout";
import Image from "next/image";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormItem } from "../features/PostForm";
import { yup } from "../lib/yup";

type SettingsForm = {
  name: string;
  userName: string;
  email: string;
  newPassword?: string;
  repeatNewPassword?: string;
  file?: File[];
};

export const userSettingsValidationSchema = yup.object().shape({
  name: yup.string().required("Please fill in your name"),
  userName: yup.string().required("Please fill in your username"),
  email: yup.string().required("Please fill in your email"),
  newPassword: yup.string(),
  repeatNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords don't match")
    .when("newPassword", {
      is: (val: any) => !!val && typeof val === "string",
      then: yup.string().required("Please fill in password"),
    }),
});

const SettingsPage = () => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const { me } = useMe();
  const form = useForm<SettingsForm>({
    mode: "all",
    resolver: yupResolver(userSettingsValidationSchema),
  });
  const {
    reset,
    control,
    formState: { dirtyFields, errors },
  } = form;
  const uploadImageMutation = useUploadImageMutation();
  const updateUserSettingsMutation = useUpdateUserSettingsMutation();
  const [createObjectURL, setCreateObjectURL] = React.useState<URL | null>(
    null
  );

  const file = useWatch({ control, name: "file" });

  React.useEffect(() => {
    if (file?.[0]) {
      const url = new URL(URL.createObjectURL(file[0]));
      setCreateObjectURL(url);
    } else if (me?.image) {
      setCreateObjectURL(new URL(me.image));
    }
  }, [me?.image, file]);

  React.useEffect(() => {
    reset({
      name: me?.name || "",
      userName: me?.userName || "",
      email: me?.email || "",
    });
  }, [reset, me]);

  const submit = form.handleSubmit(async (data) => {
    let image: string | undefined = undefined;
    console.log(dirtyFields);
    if (dirtyFields.file && data.file?.[0]) {
      const formData = new FormData();
      formData.append("file", data.file?.[0]);
      const imageResponse = await uploadImageMutation.mutateAsync({
        data: formData,
      });

      if (typeof imageResponse.imageUrl === "string") {
        image = imageResponse.imageUrl;
      }
    }

    await updateUserSettingsMutation.mutateAsync({
      userName: data.userName,
      name: data.name,
      image,
      ...(data.newPassword && data.repeatNewPassword
        ? {
            password: data.newPassword,
          }
        : {}),
    });

    window.location.reload();
  });

  return (
    <>
      <Head title={"Settings"} urlPath={"/settings"} />
      <Layout>
        <Heading title="Settings" />
        <form onSubmit={submit}>
          <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={12}>
              <Text fontSize="3xl" fontWeight="bold">
                General settings
              </Text>
            </GridItem>
            <GridItem colSpan={6}>
              <FormItem title="Name" errorMessage={errors.name?.message}>
                <Input {...form.register("name")} />
              </FormItem>
            </GridItem>
            <GridItem colSpan={6}>
              <FormItem
                title="Username"
                errorMessage={errors.userName?.message}
              >
                <Input {...form.register("userName")} />
              </FormItem>
            </GridItem>
            <GridItem colSpan={6}>
              <FormItem title="Email" errorMessage={errors.email?.message}>
                <Input {...form.register("email")} isDisabled />
              </FormItem>
            </GridItem>
            <GridItem colSpan={12}>
              <Text fontSize="3xl" fontWeight="bold">
                Password
              </Text>
            </GridItem>
            <GridItem colSpan={6}>
              <FormItem
                title="New password"
                errorMessage={errors.newPassword?.message}
              >
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type={show ? "text" : "password"}
                    {...form.register("newPassword")}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormItem>
            </GridItem>
            <GridItem colSpan={6}>
              <FormItem
                title="Repeat new password"
                errorMessage={errors.repeatNewPassword?.message}
              >
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type={show ? "text" : "password"}
                    {...form.register("repeatNewPassword")}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormItem>
            </GridItem>
            <GridItem colSpan={12}>
              <Text fontSize="3xl" fontWeight="bold">
                Profile picture
              </Text>
            </GridItem>
            <GridItem colSpan={6}>
              <Flex>
                <Box>
                  <FormItem title="Upload new profile picture">
                    <Input {...form.register("file")} type="file" />
                  </FormItem>
                </Box>
                {createObjectURL?.href && (
                  <Box borderRadius="full" overflow="hidden" ml={4}>
                    <Image
                      src={createObjectURL?.href}
                      alt="Profile picture"
                      width="100px"
                      height="100px"
                    />
                  </Box>
                )}
              </Flex>
            </GridItem>
            <GridItem colSpan={12} mt={2}>
              <Button
                type="submit"
                isLoading={updateUserSettingsMutation.isLoading}
              >
                Save
              </Button>
            </GridItem>
          </Grid>
        </form>
      </Layout>
    </>
  );
};

export default SettingsPage;
