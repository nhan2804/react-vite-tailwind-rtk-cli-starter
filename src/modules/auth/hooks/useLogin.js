import { useAppDispatch } from "@hooks/reduxHook";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";
import { login as loginAction } from "../slices";
import { login } from "../services/auth";

const useLogin = (projectId) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return useMutation(
    async (requestData) => {
      const { data } = await login(requestData);
      return data;
    },
    {
      onSuccess: (data, vari) => {
        dispatch(loginAction(data));
        const currentPath = window.sessionStorage.getItem("currentPath");
        navigate(currentPath ? currentPath : "/");
        // if (data?.user?.type === "QC") {
        //   dispatch(loginAction(data));
        //   navigate("/project-submit/" + data?.user?.projectId, {
        //     replace: true,
        //   });
        // } else {
        //   const search = window.location.search;
        //   const params = new URLSearchParams(search);
        //   dispatch(loginAction(data));
        //   if (params.get("sso")) {
        //     navigate(`/sso${window.location.search}`, { replace: true });
        //   } else {
        //     if (data?.user?.type === "SUPER_ADMIN") {
        //       navigate("/projects", { replace: true });
        //     } else {
        //       navigate("/projects/" + data?.user?.projectId + "/submits", {
        //         replace: true,
        //       });
        //     }
        //   }
        // }

        // }
      },
    }
  );
};

export default useLogin;
