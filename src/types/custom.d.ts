// Asegurar que TypeScript reconozca los módulos de alias @/
declare module '@/api/services/AuthService' {
  import { AuthResponse, User, ForgotPasswordResponse, ResetPasswordResponse } from '../types/api';
  
  interface LoginCredentials {
    email: string;
    password: string;
  }

  interface RegisterData {
    full_name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }

  interface ForgotPasswordData {
    email: string;
  }

  interface ResetPasswordData {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }

  const authService: {
    login(credentials: LoginCredentials): Promise<AuthResponse>;
    register(userData: RegisterData): Promise<AuthResponse>;
    googleLogin(idToken: string): Promise<AuthResponse>;
    forgotPassword(data: ForgotPasswordData): Promise<ForgotPasswordResponse>;
    resetPassword(data: ResetPasswordData): Promise<ResetPasswordResponse>;
    getProfile(): Promise<User>;
    logout(): Promise<void>;
    isAuthenticated(): boolean;
    hasValidToken(): boolean;
  };

  export default authService;
}
