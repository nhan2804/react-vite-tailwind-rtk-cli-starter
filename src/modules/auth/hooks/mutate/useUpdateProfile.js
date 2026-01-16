import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProfile } from "@modules/auth/services/auth";
import { message } from "antd";

const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (requestData) => {
      const { data } = await updateProfile(requestData);
      return data;
    }
  });
};

export default useUpdateProfile;
