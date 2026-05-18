import { create } from 'zustand';
import { Language } from '../lib/translations';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'pt',
  setLanguage: (language) => set({ language }),
}));
