export interface UserInfo {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  fullName: string | null;
  address: string | null;
  phoneNumber: string | null;
  is_activated: boolean;
  role: string;
  created_at: string;
  updated_at: string;
  testSessions: TestSession[];
  testStats: TestStats;
  testHistory: TestHistory;
  latestTestDate: string;
  latestTestScore: number;
  highestScore: number;
}

export interface TestSession {
  test_session_id: number;
  test_id: number;
  test_name: string;
  test_type: string;
  test_session_listening_score: number;
  test_session_reading_score: number;
  test_session_total_score: number;
  completed_at: string;
  status?: string;
  responses?: any[];
  partScores?: any[];
}

export interface TestStats {
  totalFullTests: number;
  totalMiniTests: number;
  totalPracticeTests: number;
  averageScore: number;
  recentTests: TestSession[];
}

export interface TestHistory {
  recent: RecentTest[];
  stats: {
    totalFullTests: number;
    totalMiniTests: number;
    totalPracticeTests: number;
    averageScore: number;
    highestScore: number;
    analysisScores: {
      listening: number;
      reading: number;
      grammar: number;
      comprehension: number;
    };
  };
}

export interface RecentTest {
  id: number;
  testId: number;
  testName: string;
  type: string;
  score: number | null;
  completedAt: string | null;
  status: string;
}

export interface UserInfoResponse {
  data: UserInfo;
  message: string;
  statusCode: number;
}

export interface UserListResponse {
  data: {
    users: UserInfo[];
    total: number;
  };
  message: string;
  statusCode: number;
}

export interface PartScores {
  partAverages: {
    part1: number;
    part2: number;
    part3: number;
    part4: number;
    part5: number;
    part6: number;
    part7: number;
  };
  totalTests: number;
}

export interface PartScoresResponse {
  statusCode: number;
  success: boolean;
  data: PartScores;
  message: string;
  timestamp: string;
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

export interface UserProgressResponse {
  statusCode: number;
  success: boolean;
  data: UserProgress;
  message: string;
  timestamp: string;
}
