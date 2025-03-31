import { api } from "./api";

export interface LeaderboardEntry {
  referrer_id: number;
  full_name: string;
  referrals_count: number;
}

export interface GetLeaderboardResponse {
  status: string;
  error: string;
  data: LeaderboardEntry[];
}

export const leaderboardService = {
  getLeaderboard: async (): Promise<GetLeaderboardResponse> => {
    try {
      const response = await api.get("/leaderboard");

      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch leaderboard: " + error);
    }
  },
};
