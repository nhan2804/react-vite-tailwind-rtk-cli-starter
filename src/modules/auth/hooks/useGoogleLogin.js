import { useAppDispatch } from "@hooks/reduxHook";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";
import { login as loginAction } from "../slices";
import { googleLogin } from "../services/auth";

const useGoogleLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return useMutation(
    async (requestData) => {
      const { data } = await googleLogin(requestData);
      return await new Promise((resolve) => {
        resolve(data);
      });
    },
    {
      onSuccess: (data) => {
        console.log(data);
        dispatch(loginAction(data));
        navigate("/projects", { replace: true });
      },
    }
  );
};

export default useGoogleLogin;
