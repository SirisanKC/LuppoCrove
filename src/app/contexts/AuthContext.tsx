/**
 * Authentication Context for LuppoGrove
 * * Provides global authentication state and methods to all components
 * Updated to use Supabase Email/Password authentication
 */
import { toast } from "sonner";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User, AuthState } from '../services/auth';
import { supabase } from "../services/supabaseClient";

interface AuthContextType extends AuthState {
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  loginAsStudent: () => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>(() => 
    authService.getAuthState()
  );

  // Initialize auth state on mount
  useEffect(() => {
    const state = authService.getAuthState();
    setAuthState(state);
  }, []);

  // ==========================================
  // 🚀 LOGIN ACTIONS
  // ==========================================

  const loginWithEmail = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    
    try {
      const user = await authService.loginWithEmail(email, password);
      
      const newState = authService.getAuthState();
      setAuthState(newState);

      // Redirect them to the correct dashboard based on their role
      if (user.role === 'teacher') {
        window.location.href = '/teacher';
      } else if (user.role === 'company') {
        window.location.href = '/company';
      } else if (user.role === 'student') {
        window.location.href = '/student';
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      
      // We throw the error so the UI (EntryPortal.tsx) can handle it or show an alert
      toast.error(error.message || 'Login failed. Please check your credentials.');
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      await authService.loginWithGoogle();
    } catch (error: any) {
      console.error('Google login failed:', error);
      toast.error("Failed to connect to Google.");
    }
  };

  useEffect(() => {
    const state = authService.getAuthState();
    setAuthState(state);

    // Listen for the moment they come back from Google
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        
        // 1. Fetch profile with a retry loop (Fixes the race condition!)
        let profile = null;
        for (let i = 0; i < 3; i++) {
          const { data } = await supabase
            .from('profiles')
            .select('status, role, organization')
            .eq('id', session.user.id)
            .single();
          
          if (data) {
            profile = data;
            break;
          }
          // If the DB is still creating the profile, wait 500ms and try again
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // 2. 🛑 THE BOUNCER: Kick them out if pending OR if the profile failed to create
        if (!profile || profile.status === 'pending') {
          await authService.logout(); // Log them out
          toast.info("Your account is pending admin approval. Please check back later!");
          return;
        }

        // 3. If approved, let them in!
        const mappedUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || 'LuppoGrove User',
          role: profile.role || 'company',
          organization: profile.organization || 'Registered Organization',
        };

        const newAuthState = {
          user: mappedUser,
          tokens: {
             accessToken: session.access_token,
             expiresAt: session.expires_at ? session.expires_at * 1000 : Date.now() + 3600000,
          },
          isAuthenticated: true,
          isLoading: false,
        };

        // 4. Save to localStorage so they stay logged in if they refresh the page
        localStorage.setItem('luppogrove_auth', JSON.stringify(newAuthState));
        setAuthState(newAuthState);

        // 5. REDIRECT THEM! (This was missing)
        if (mappedUser.role === 'teacher') {
          window.location.href = '/teacher';
        } else if (mappedUser.role === 'student') {
          window.location.href = '/student';
        } else {
          window.location.href = '/company';
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const resetPassword = async (email: string) => {
    try {
      await authService.resetPassword(email);
    } catch (error: any) {
      console.error('Password reset failed:', error);
      throw error; 
    }
  };

  const updatePassword = async (password: string) => {
    try {
      await authService.updatePassword(password);
    } catch (error: any) {
      console.error('Update password failed:', error);
      throw error; 
    }
  };

  const loginAsStudent = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      await authService.mockStudentLogin();
    } catch (error) {
      console.error('Student login failed:', error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Always clear local state and redirect, even if Supabase call fails
      localStorage.removeItem('luppogrove_auth');
      window.location.href = '/';
    }
  };

  const refreshAuth = () => {
    const state = authService.getAuthState();
    setAuthState(state);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        loginWithEmail,
        loginWithGoogle,
        resetPassword,
        updatePassword,
        loginAsStudent,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}