import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      
      setAuth: (user, token) => set({ 
        user, 
        token, 
        isLoggedIn: !!user 
      }),
      
      logout: () => set({ 
        user: null, 
        token: null, 
        isLoggedIn: false 
      }),
      
      updateUser: (userData) => set((state) => ({
        user: state.user 
          ? { 
              ...state.user, 
              ...userData,
              appointments: userData.appointments || state.user.appointments || []
            } 
          : {
              ...userData,
              appointments: userData.appointments || []
            }
      }))
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
