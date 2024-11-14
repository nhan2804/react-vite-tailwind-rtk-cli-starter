import { useMutation, useQueryClient } from "react-query";

import { updateProfile } from "@modules/auth/services/auth";
import { message } from "antd";

const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (requestData) => {
      const { data } = await updateProfile(requestData);
      return data;
    },
    {
      onSuccess: (data, vari) => {
        message.success("Thay đổi thông tin thành công!");
        queryClient.refetchQueries(["userProfile"]);
      },
    }
  );
};

export default useUpdateProfile;
