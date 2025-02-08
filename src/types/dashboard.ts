export interface ScoreDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface TopScorer {
  email: string;
  highestScore: number | null;
}

export interface CompletedTestsStats {
  weekly: number;
  monthly: number;
  quarterly: number;
  yearly: number;
}

export interface PopularTest {
  id: number;
  name: string;
  type: "PART_TEST" | "FULL_TEST" | "MINI_TEST";
  maxScore: number;
  totalAttempts: number;
  averageScore: number;
  highestScore: number;
}

export interface TodayStats {
  date: string;
  totalUsers: number;
  newUsers: number;
  completedTests: number;
  averageScore: number;
  topScore: number;
  topScorer: TopScorer;
  completedTestsStats: CompletedTestsStats;
  scoreDistribution: ScoreDistribution[];
  popularTests: PopularTest[];
}

export interface YesterdayStats {
  id: number;
  date: string;
  totalUsers: number;
  newUsers: number;
  completedTests: number;
  averageScore: number;
  topScorerId: number;
  topScore: number;
  createdAt: string;
}

export interface DashboardStatsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    todayStats: TodayStats;
    yesterdayStats: YesterdayStats;
    popularTests: PopularTest[];
  };
}

export enum StatsPeriod {
  WEEK = "week",
  MONTH = "month",
  QUARTER = "quarter",
  YEAR = "year",
}

export interface PeriodStats {
  period: string;
  total: number;
  averageScore: number;
}

export interface PeriodStatsResponse {
  statusCode: number;
  success: boolean;
  data: PeriodStats[];
  message: string;
  timestamp: string;
}

export interface TestSession {
  test_session_id: number;
  test_session_listening_score: number;
  test_session_reading_score: number;
  test_session_total_score: number;
  test_id: number;
  test_name: string;
  test_type: string;
  completed_at: string;
}

export interface UserProgress {
  overview: {
    averageScore: number;
    highestScore: number;
    averageListening: number;
    averageReading: number;
    totalSessions: number;
    inProgressSessions: number;
    completedSessions: number;
  };
  stats: {
    analysisScores: {
      listening: number;
      reading: number;
      grammar: number;
      comprehension: number;
    };
  };
  testSessions: TestSession[];
}
