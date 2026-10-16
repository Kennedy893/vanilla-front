
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: "bearer";
  id: number;
  username: string;
  organization_id: number | null;
  organization_role: string | null;
}
