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
