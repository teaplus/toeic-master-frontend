import React from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

interface GoogleLoginButtonProps {
  onLoginSuccess: (token: string) => void;
  onLoginFailure?: (error: any) => void;
  type: string;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onLoginSuccess,
  onLoginFailure,
}) => {
  return (
    <div>
      <GoogleLogin
        onSuccess={(credentialResponse: CredentialResponse) => {
          if (credentialResponse.credential) {
            onLoginSuccess(credentialResponse.credential);
          }
        }}
        onError={() => {
          if (onLoginFailure) {
            onLoginFailure("Google Login Failed");
          }
        }}
        text="continue_with"
      />
    </div>
  );
};

export default GoogleLoginButton;
