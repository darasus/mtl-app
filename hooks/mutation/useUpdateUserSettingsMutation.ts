import { useMutation } from "react-query";
import { useFetcher } from "../useFetcher";
import { useMe } from "../useMe";

export const useUpdateUserSettingsMutation = () => {
  const fetcher = useFetcher();
  const { me } = useMe();
  return useMutation(
    ({
      userName,
      name,
      image,
      password,
    }: {
      userName?: string;
      name?: string;
      image?: string;
      password?: string;
    }) =>
      fetcher.updateUserSettings({
        userId: me?.id as string,
        userName,
        name,
        image,
        password,
      })
  );
};
