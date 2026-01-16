import { useAppDispatch } from "@hooks/reduxHook";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { login as loginAction } from "../slices";
import { googleLogin } from "../services/auth";

const useGoogleLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: async (requestData) => {
      const { data } = await googleLogin(requestData);
      return await new Promise((resolve) => {
        resolve(data);
      });
    }
  });
};

export default useGoogleLogin;
