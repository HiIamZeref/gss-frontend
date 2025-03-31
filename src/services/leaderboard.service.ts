import { api } from "./api";

export interface LeaderboardEntry {
  ReferralId: number;
  ReferrersCount: number;
}

export const leaderboardService = {
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    try {
      const response = await api.get("/leaderboard");

      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch leaderboard: " + error);
    }
  },
};
