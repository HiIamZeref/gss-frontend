import { api } from "./api";

export interface CreateUserRequest {
  full_name: string;
  email: string;
  phone_number: string;
}

export interface CreateUserResponse {
  id: string;
  full_name: string;
  referralCode: string;
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
