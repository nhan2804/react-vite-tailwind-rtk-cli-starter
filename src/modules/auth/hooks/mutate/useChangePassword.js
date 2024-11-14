import { useMutation } from "react-query";

import { changePassword } from "@modules/auth/services/auth";
import { message } from "antd";

const useChangePassword = () => {
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
      },
    }
  );
};

export default useChangePassword;
