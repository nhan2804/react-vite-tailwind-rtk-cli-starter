import { useAppDispatch } from "@hooks/reduxHook";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";
import { register } from "../services/auth";
import { login as loginAction } from "../slices";

const useRegister = () => {
  const history = useNavigate();
  const dispatch = useAppDispatch();
  return useMutation(
    async (requestData) => {
      const { data } = await register(requestData);
      return await new Promise((resolve) => {
        console.log("auth ws");

        resolve(data);
      });
    },
    {
      onSuccess: (data) => {
        dispatch(loginAction(data));
        history("/projects");
      },
    }
  );
};

export default useRegister;
