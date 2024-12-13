export interface IAuthResponse {
  id: string;
  name: string;
  email: string;
  accessToken: string;
}

export interface IResgisterPayload {
  name: string;
  email: string;
  password: string;
}
