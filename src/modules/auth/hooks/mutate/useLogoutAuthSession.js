import { useMutation, useQueryClient } from "react-query";

import { message } from "antd";
import { logoutSession } from "@modules/auth/services/auth";
import { useAppDispatch } from "@hooks/reduxHook";
import { useNavigate } from "react-router";
import { logout as logoutAction } from "@modules/auth/slices";

const useLogoutAuthSession = () => {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  const naviagte = useNavigate();
  return useMutation(
    async (requestData) => {
      const { data } = await logoutSession(requestData);
      return data;
    },
    {
      onSuccess: (data, vari) => {
        if (vari?.logOutAll) {
          dispatch(logoutAction());
          qc.removeQueries("user");
          naviagte("/login", { replace: true });
        }
        message.success("Logout thành công!");
        qc.invalidateQueries(["auth-sessions"]);
      },
    }
  );
};

export default useLogoutAuthSession;
