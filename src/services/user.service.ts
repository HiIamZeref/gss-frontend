import { api } from "./api";

export interface CreateUserRequest {
  full_name: string;
  email: string;
  phone_number: string;
  referrer_code: string;
}

export interface CreateUserResponse {
  status: string;
  error: string;
  data: UserData;
}

export interface UserData {
  id: number;
  full_name: string;
  referral_code: string;
}

export const userService = {
  create: async (data: CreateUserRequest): Promise<CreateUserResponse> => {
    try {
      const response = await api.post("/users", data);

      return response.data;
    } catch (error) {
      throw new Error("Failed to register user: " + error);
    }
  },
};
