import { useAppDispatch } from "@hooks/reduxHook";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useNavigate } from "react-router";
// import { logout } from "../services/auth";
import { logout as logoutAction } from "../slices/index";
import { logout } from "../services/auth";

const useLogout = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const naviagte = useNavigate();
  return useMutation({
    mutationFn: async () => {
      const { data } = await logout();
      return data;
    }
  });
};

export default useLogout;
