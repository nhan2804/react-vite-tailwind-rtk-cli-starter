import { useMutation, useQueryClient } from "@tanstack/react-query";

import { message } from "antd";
import { logoutSession } from "@modules/auth/services/auth";
import { useAppDispatch } from "@hooks/reduxHook";
import { useNavigate } from "react-router";
import { logout as logoutAction } from "@modules/auth/slices";

const useLogoutAuthSession = () => {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  const naviagte = useNavigate();
  return useMutation({
    mutationFn: async (requestData) => {
      const { data } = await logoutSession(requestData);
      return data;
    }
  });
};

export default useLogoutAuthSession;
