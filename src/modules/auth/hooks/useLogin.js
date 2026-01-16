import { useAppDispatch } from "@hooks/reduxHook";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { login as loginAction } from "../slices";
import { login } from "../services/auth";

const useLogin = (projectId) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (requestData) => {
      const { data } = await login(requestData);
      return data;
    },
    onSuccess: (data) => {
      dispatch(loginAction(data));
      navigate("/");
    },
  });
};

export default useLogin;
