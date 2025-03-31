import { api } from "./api";

export const leaderboardService = {
  getLeaderboard: async () => {
    try {
      const response = await api.get("/leaderboard");

      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch leaderboard: " + error);
    }
  },
};
