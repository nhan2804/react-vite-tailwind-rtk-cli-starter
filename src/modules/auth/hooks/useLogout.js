import { useAppDispatch } from "@hooks/reduxHook";
import { useMutation, useQueryClient } from "react-query";

import { useNavigate } from "react-router";
// import { logout } from "../services/auth";
import { logout as logoutAction } from "../slices/index";
import { logout } from "../services/auth";

const useLogout = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const naviagte = useNavigate();
  return useMutation(
    async () => {
      const { data } = await logout();
      return data;
    },
    {
      onSuccess: () => {
        dispatch(logoutAction());
        queryClient.removeQueries("user");
        naviagte("/login", { replace: true });
      },
    }
  );
};

export default useLogout;
