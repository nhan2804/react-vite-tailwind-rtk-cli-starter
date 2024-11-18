import { useMutation, useQueryClient } from "react-query";

import { changePassword } from "@modules/auth/services/auth";
import { message } from "antd";
import { useAppDispatch } from "@hooks/reduxHook";
import { useNavigate } from "react-router";
import { logout as logoutAction } from "@modules/auth/slices";

const useChangePassword = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const naviagte = useNavigate();
  return useMutation(
    async (requestData) => {
      const { data } = await changePassword(requestData);
      return data;
    },
    {
      onSuccess: (data, vari) => {
        message.success(
          "Thay đổi mật khẩu thành công, vui lòng đăng nhập lại!"
        );
        dispatch(logoutAction());
        queryClient.removeQueries("user");
        naviagte("/login", { replace: true });
      },
    }
  );
};

export default useChangePassword;
