export interface User {
    username: string;
    email: string;
    avatar: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export type AuthStore = {
    isAuthenticated: boolean;
    user: User | null;
    setUser: (user: User) => void;
    clearIsAuthenticated: () => void;
}

export interface CheckSessionRequest {
    success: boolean;
}

export interface UpdateUserRequest {
    username?: string;
}