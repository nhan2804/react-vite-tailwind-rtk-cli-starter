import { BASE_URL_SSO } from "@config/axios";
import { useAppDispatch } from "@hooks/reduxHook";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";
import { login as loginAction } from "../slices";
const useLoginSSO = () => {
  const nav = useNavigate();
  const handleLogin = useMutation(
    async (requestData) => {
      const { data } = await axios.post("/auth/sso", requestData);
      return data;
    },
    {
      onSuccess: (data) => {},
    }
  );
  const login = () => {
    window.open(
      `${BASE_URL_SSO}sso?redirect=${window.location.hostname}&popup=true`,
      "SSO login",
      "height=600,width=400"
    );
  };
  const dispatch = useAppDispatch();
  useEffect(() => {
    const handle = async (e) => {
      try {
        const data = JSON.parse(e.data);
        handleLogin.mutate(
          { "sso-token": data?.token },
          {
            onSuccess: (d) => {
              dispatch(loginAction(d));

              nav(`/projects`, { replace: true });
            },
          }
        );
      } catch (error) {}
    };
    window.addEventListener("message", handle, false);

    return () => {
      window.removeEventListener("message", handle);
    };
  }, [dispatch, handleLogin, nav]);
  return { openLogin: login, isLoading: handleLogin.isLoading };
};

export default useLoginSSO;
