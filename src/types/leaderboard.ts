export interface TopScorer {
  userId: number;
  fullName: string | null;
  avatar: string;
  highestScore: number;
  testName: string;
  achievedAt: string;
}

export interface ActiveUser {
  userId: number;
  fullName: string | null;
  avatar: string;
  totalTests: number;
  averageScore: number;
  highestScore: number;
}

export interface LeaderboardData {
  topScorers: TopScorer[];
  mostActive: ActiveUser[];
}

export interface LeaderboardResponse {
  statusCode: number;
  success: boolean;
  data: LeaderboardData;
  message: string;
  timestamp: string;
}
