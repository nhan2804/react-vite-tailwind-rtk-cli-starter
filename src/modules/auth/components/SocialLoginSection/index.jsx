import { useAppSelector } from "@hooks/reduxHook";
import useFacebookLogin from "@modules/auth/hooks/useFacebookLogin";
import useGoogleLogin from "@modules/auth/hooks/useGoogleLogin";
import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

const SocialLoginSection = () => {
  const { mutate: loginWithGoogle } = useGoogleLogin();
  const { mutate: loginWithFacebook } = useFacebookLogin();

  //   const isAuth = useAppSelector((state) => state?.auth?.isAuth);
  const responseGoogle = (res) => {
    console.log(res);
    loginWithGoogle({ id_token: res?.tokenId });
  };
  const responseFacebook = (res) => {
    console.log(res);
    loginWithFacebook({ access_token: res?.accessToken });
    // loginWithGoogle({ id_token: res?.tokenId });
  };
  // useRedirect([{ condition: isAuth, to: "/" }]);

  return (
    <div className="flex space-x-6">
      {/* <div className="flex-auto p-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg shadow">
              Sign up with facebook
            </div> */}
    </div>
  );
};

export default SocialLoginSection;
