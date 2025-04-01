import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  lastPath: string;
  setLastPath: (path: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      lastPath: '/dashboard',
      signIn: async (email, password) => {
        // Mock login for presentation
        if (email === 'demo@edtodo.tech' && password === 'demo123') {
          set({ 
            user: { 
              id: 1, 
              email: 'demo@edtodo.tech',
              username: 'Demo User'
            },
            loading: false 
          });
        } else {
          throw new Error('Invalid email or password');
        }
      },
      signOut: async () => {
        set({ user: null, loading: false });
      },
      checkAuth: async () => {
        // For presentation, we'll skip auth check
        set({ loading: false });
      },
      setLastPath: (path) => set({ lastPath: path }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        lastPath: state.lastPath,
      }),
    }
  )
);