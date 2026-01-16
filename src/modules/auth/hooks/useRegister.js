import { useAppDispatch } from "@hooks/reduxHook";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { register } from "../services/auth";
import { login as loginAction } from "../slices";

const useRegister = () => {
  const history = useNavigate();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: async (requestData) => {
      const { data } = await register(requestData);
      return await new Promise((resolve) => {
        console.log("auth ws");

        resolve(data);
      });
    }
  });
};

export default useRegister;
