import { useEffect } from "react";
import { useNavigate } from "react-router";

const useRedirect = (params) => {
  const history = useNavigate();
  useEffect(() => {
    params.some(({ condition, to, cb }) => {
      // console.log(condition, to);
      if (condition) {
        history(to, { replace: true });
        cb?.();
      }
      return condition;
    });
    return () => {};
  }, [params, history]);
};

export default useRedirect;
