export interface IAuthResponse {
  id: string;
  name: string;
  email: string;
  accessToken: string;
}

export interface IResgisterPaykload {
  name: string;
  email: string;
  password: string;
}
