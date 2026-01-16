import { useAppDispatch } from "@hooks/reduxHook";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { login as loginAction } from "../slices";
import { facebookLogin } from "../services/auth";

const useFacebookLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: async (requestData) => {
      const { data } = await facebookLogin(requestData);
      return await new Promise((resolve) => {
        resolve(data);
      });
    }
  });
};

export default useFacebookLogin;
