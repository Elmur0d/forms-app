import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

const useTemplateStore = create((set) => ({
  myTemplates: [],
  isLoading: false,
  error: null,

  fetchMyTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.get(`${API_URL}/api/templates/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ myTemplates: response.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch user's templates:", error);
      set({ error: 'Не удалось загрузить шаблоны', isLoading: false });
    }
  },
}));

export default useTemplateStore;