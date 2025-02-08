export interface Login {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_Token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export interface LoginResponseType {
  data: LoginResponse;
}

export interface Register {
  username: string;
  password: string;
  email: string;
}

export interface RegisterResponse {
  message: string;
  
}

export interface RegisterResponseType {
  data: RegisterResponse;
}


export interface VerifyResponse {
  message: string;
}

export interface VerifyResponseType {
  data: VerifyResponse;
  statusCode: number;
}

export interface ResetPassword {
  token: string;
  email: string;
  newPass: string;
}

export interface ResetPasswordResponse {
  message: string;
}


