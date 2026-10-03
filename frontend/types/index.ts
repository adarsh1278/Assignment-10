export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface DayStatus {
  date: string; // YYYY-MM-DD
  status: string;
  updatedAt: string;
  updatedBy: {
    email: string;
  };
}

export interface ApiResponse<T = undefined> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
}
