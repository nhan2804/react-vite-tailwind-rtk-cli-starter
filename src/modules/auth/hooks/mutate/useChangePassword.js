import { useMutation, useQueryClient } from "@tanstack/react-query";

import { changePassword } from "@modules/auth/services/auth";
import { message } from "antd";
import { useAppDispatch } from "@hooks/reduxHook";
import { useNavigate } from "react-router";
import { logout as logoutAction } from "@modules/auth/slices";

const useChangePassword = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const naviagte = useNavigate();
  return useMutation({
    mutationFn: async (requestData) => {
      const { data } = await changePassword(requestData);
      return data;
    }
  });
};

export default useChangePassword;
