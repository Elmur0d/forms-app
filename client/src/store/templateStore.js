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

  createTemplate: async (templateData) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.post(`${API_URL}/api/templates`, templateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Добавляем новый шаблон в начало списка
      set((state) => ({
        myTemplates: [response.data, ...state.myTemplates],
        isLoading: false,
      }));
      return { success: true };
    } catch (error) {
      console.error("Failed to create template:", error);
      set({ error: 'Не удалось создать шаблон', isLoading: false });
      return { success: false };
    }
  },
}));

export default useTemplateStore;