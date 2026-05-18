import { create } from "zustand";
import { QRCodeState, defaultOptions, defaultContent } from "../types/qrcode";
import { formatQRCodeData } from "../lib/qrcode-utils";

export const useQRCodeStore = create<QRCodeState>((set) => ({
  options: defaultOptions,
  content: defaultContent,
  setOptions: (newOptions) =>
    set((state) => ({
      options: { ...state.options, ...newOptions },
    })),
  setContent: (newContent) =>
    set((state) => {
      const updatedContent = { ...state.content, ...newContent };
      
      // Initialize sub-objects if they don't exist when switching types
      if (newContent.type) {
        if (newContent.type === 'wifi' && !updatedContent.wifi) {
          updatedContent.wifi = { ssid: '', password: '', encryption: 'WPA' };
        }
        if (newContent.type === 'email' && !updatedContent.email) {
          updatedContent.email = { address: '', subject: '', body: '' };
        }
        if (newContent.type === 'sms' && !updatedContent.sms) {
          updatedContent.sms = { phone: '', message: '' };
        }
        if (newContent.type === 'vcard' && !updatedContent.vcard) {
          updatedContent.vcard = { firstName: '', lastName: '' };
        }
      }

      return {
        content: updatedContent,
        options: {
          ...state.options,
          data: formatQRCodeData(updatedContent as any)
        }
      };
    }),
  resetOptions: () => set({ options: defaultOptions, content: defaultContent }),
  applyPreset: (presetOptions) =>
    set((state) => ({
      options: { ...state.options, ...presetOptions },
    })),
}));

