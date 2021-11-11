import { useMutation } from "react-query";
import { useFetcher } from "../useFetcher";
import { useMe } from "../useMe";

export const useUpdateUserSettingsMutation = () => {
  const fetcher = useFetcher();
  const me = useMe();
  return useMutation(
    ({
      nickname,
      name,
      image,
      password,
      email,
    }: {
      nickname?: string;
      name?: string;
      image?: string;
      password?: string;
      email?: string;
    }) =>
      fetcher.updateUserSettings({
        userId: me?.user?.id as string,
        nickname,
        name,
        image,
        password,
        email,
      })
  );
};
