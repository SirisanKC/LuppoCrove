/**
 * Authentication Service for LuppoGrove
 * Powered by Supabase Auth (Email & Password)
 */

import { supabase } from './supabaseClient';

export type UserRole = 'teacher' | 'student' | 'company';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization: string;
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

class AuthService {
  private storageKey = 'luppogrove_auth';

  getAuthState(): AuthState {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        return this.getDefaultState();
      }

      const state: AuthState = JSON.parse(stored);
      
      // Check if the token has expired
      if (state.tokens && state.tokens.expiresAt < Date.now()) {
        this.clearAuth();
        return this.getDefaultState();
      }

      return state;
    } catch (error) {
      console.error('Failed to load auth state:', error);
      return this.getDefaultState();
    }
  }

  private getDefaultState(): AuthState {
    return {
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
    };
  }

  private saveAuthState(state: AuthState): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save auth state:', error);
    }
  }

  clearAuth(): void {
    localStorage.removeItem(this.storageKey);
  }

  // ==========================================
  // 🚀 STANDARD EMAIL/PASSWORD LOGIN
  // ==========================================

  async loginWithEmail(email: string, password: string): Promise<User> {
    // 1. Send credentials to Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    // 2. Handle invalid credentials
    if (error || !data.session) {
      throw new Error(error?.message || 'Invalid email or password');
    }

    const sbUser = data.session.user;

    // 3. Map the Supabase database info to your frontend state
    const mappedUser: User = {
      id: sbUser.id,
      email: sbUser.email || '',
      name: sbUser.user_metadata?.full_name || 'LuppoGrove User',
      role: sbUser.user_metadata?.role || 'teacher', // Defaults to teacher if missing
      organization: sbUser.user_metadata?.organization || 'Organization',
    };
    
    // 4. Save the active session locally so the user stays logged in
    const authState: AuthState = {
      user: mappedUser,
      tokens: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at ? data.session.expires_at * 1000 : Date.now() + 3600000,
      },
      isAuthenticated: true,
      isLoading: false,
    };

    this.saveAuthState(authState);
    return mappedUser;
  }

  // ==========================================
  // 🌐 GOOGLE OAUTH LOGIN
  // ==========================================
  
  async loginWithGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // This tells Supabase to send them back to your localhost after Google approves them
        redirectTo: window.location.origin, 
      }
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  // ==========================================
  // 🔑 FORGOT PASSWORD
  // ==========================================

  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // This tells Supabase where to send the user after they click the email link
      redirectTo: window.location.origin + '/update-password', 
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  // ==========================================
  // 🔄 UPDATE PASSWORD (After clicking email link)
  // ==========================================

  async updatePassword(newPassword: string): Promise<void> {
    // Supabase knows who is asking because they clicked the secure email link
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  // ==========================================
  // 🛑 LOGOUT
  // ==========================================

  async logout(): Promise<void> {
    // Tell Supabase to destroy the session securely on the server
    await supabase.auth.signOut();
    
    // Clear the local frontend state
    this.clearAuth();
  }

  // ==========================================
  // 🧪 MOCK STUDENT LOGIN (Kept for UI Testing)
  // ==========================================

  mockStudentLogin(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: 'student_' + Math.random().toString(36).substr(2, 9),
          email: 'sara.korhonen@aalto.fi',
          name: 'Sara Korhonen',
          role: 'student',
          organization: 'Aalto University',
        };

        const mockTokens: AuthTokens = {
          accessToken: 'mock_student_access_token_' + Date.now(),
          expiresAt: Date.now() + 3600000,
        };

        const authState: AuthState = {
          user: mockUser,
          tokens: mockTokens,
          isAuthenticated: true,
          isLoading: false,
        };

        this.saveAuthState(authState);
        window.location.href = '/student';
        resolve();
      }, 1000);
    });
  }
}

export const authService = new AuthService();
export default AuthService;