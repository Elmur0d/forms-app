import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_URL = '';

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      login: async (email, password) => {
        try {
          const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
          const { token } = response.data;
          
          const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({ token, user: userResponse.data });
          return { success: true };
        } catch (error) {
          console.error('Login failed:', error);
          return { success: false, error: 'Неверный email или пароль' };
        }
      },

      logout: () => set({ token: null, user: null }),

      register: async (name, email, password) => {
        try {
          await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
          const loginResult = await get().login(email, password);
          return loginResult;
        } catch (error) {
          console.error('Registration failed:', error);
          const errorMessage = error.response?.data?.msg || 'Ошибка регистрации';
          return { success: false, error: errorMessage };
        }
      },
    }),
    {
      name: 'auth-storage', 
    }
  )
);

export default useAuthStore;