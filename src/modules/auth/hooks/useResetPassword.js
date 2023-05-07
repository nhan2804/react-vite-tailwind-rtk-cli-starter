import { useAppDispatch } from "@hooks/reduxHook";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";
import { login as loginAction } from "../slices";
import { reset_password } from "../services/auth";

const useResetPassword = () => {
  return useMutation(
    async (requestData) => {
      const { data } = await reset_password(requestData);
      return data;
    },
    {
      onSuccess: (data) => {},
    }
  );
};

export default useResetPassword;
