import { Button } from "@chakra-ui/button";
import { FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Grid, GridItem, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { Head } from "../components/Head";
import { Heading } from "../components/Heading";
import { useUploadImageMutation } from "../hooks/mutation/useUploadImageMutation";
import { useMe } from "../hooks/useMe";
import { Layout } from "../layouts/Layout";

interface SettingsForm {
  name: string;
  userName: string;
  email: string;
  newPassword: string;
  repeatNewPassword: string;
  profilePicture: string;
  file: File[];
}

const SettingsPage = () => {
  const { me } = useMe();
  const form = useForm<SettingsForm>();
  const { reset, control } = form;
  const uploadImageMutation = useUploadImageMutation();

  const file = useWatch({
    name: "file",
    control,
  });

  console.log({ me });

  React.useEffect(() => {
    reset({
      name: me?.name || "",
      userName: me?.userName || "",
      email: me?.email || "",
    });
  }, [reset, me]);

  React.useEffect(() => {
    if (file && !uploadImageMutation.isLoading && !uploadImageMutation.error) {
      const formData = new FormData();
      formData.append("file", file[0]);
      uploadImageMutation.mutate({
        file: formData,
      });
    }
  }, [file, uploadImageMutation]);

  return (
    <>
      <Head title={"Settings"} urlPath={"/settings"} />
      <Layout>
        <Heading title="Settings" />
        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={12}>
            <Text fontSize="3xl" fontWeight="bold">
              General settings
            </Text>
          </GridItem>
          <GridItem colSpan={6}>
            <FormLabel>Name</FormLabel>
            <Input {...form.register("name")} />
          </GridItem>
          <GridItem colSpan={6}>
            <FormLabel>Username</FormLabel>
            <Input {...form.register("userName")} />
          </GridItem>
          <GridItem colSpan={6}>
            <FormLabel>Email</FormLabel>
            <Input {...form.register("email")} />
          </GridItem>
          <GridItem colSpan={12}>
            <Text fontSize="3xl" fontWeight="bold">
              Password
            </Text>
          </GridItem>
          <GridItem colSpan={6}>
            <FormLabel>New password</FormLabel>
            <Input {...form.register("newPassword")} />
          </GridItem>
          <GridItem colSpan={6}>
            <FormLabel>Repeat password</FormLabel>
            <Input {...form.register("repeatNewPassword")} />
          </GridItem>
          <GridItem colSpan={12}>
            <Text fontSize="3xl" fontWeight="bold">
              Profile picture
            </Text>
          </GridItem>
          <GridItem colSpan={6}>
            <FormLabel>
              Upload new profile picture{" "}
              {uploadImageMutation.isLoading && <Spinner />}
            </FormLabel>
            <Input {...form.register("file")} type="file" />
          </GridItem>
          <GridItem colSpan={12} mt={2}>
            <Button>Save</Button>
          </GridItem>
        </Grid>
      </Layout>
    </>
  );
};

export default SettingsPage;
