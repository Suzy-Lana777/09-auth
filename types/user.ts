export interface User {
  id: string;        // якщо є
  username: string;
  email: string;
  avatar: string;
}

export interface UpdateUserRequest {
  username?: string;
}

export interface UserResponse {
  user: User;
}

