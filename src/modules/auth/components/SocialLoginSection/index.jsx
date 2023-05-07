import { useAppSelector } from "@hooks/reduxHook";
import useFacebookLogin from "@modules/auth/hooks/useFacebookLogin";
import useGoogleLogin from "@modules/auth/hooks/useGoogleLogin";
import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
// import { useGoogleLogin } from "react-google-login";
import { useGoogleLogin as useGoogleLoginApi } from "react-google-login";
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
  const { signIn, loaded } = useGoogleLoginApi({
    clientId:
      "761742502120-1tss44f7h42m2divfqg2dhcvo3608cl2.apps.googleusercontent.com",
    cookiePolicy: "single_host_origin",
    onSuccess: responseGoogle,
    onFailure: (err) => console.log(err),
  });
  return (
    <div className="flex space-x-6">
      <button
        // disabled={!loaded}
        type="button"
        className="flex-auto p-2 text-sm font-medium text-gray-700 transition-colors bg-gray-200 rounded-lg shadow disabled:bg-gray-400"
        onClick={signIn}
      >
        Sign up with google
      </button>
      <FacebookLogin
        appId="3202964793268811"
        // autoLoad
        callback={responseFacebook}
        render={(renderProps) => (
          <button
            type="button"
            onClick={renderProps.onClick}
            className="flex-auto p-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg shadow"
          >
            Sign up with facebook
          </button>
        )}
      />
      {/* <div className="flex-auto p-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg shadow">
              Sign up with facebook
            </div> */}
    </div>
  );
};

export default SocialLoginSection;
