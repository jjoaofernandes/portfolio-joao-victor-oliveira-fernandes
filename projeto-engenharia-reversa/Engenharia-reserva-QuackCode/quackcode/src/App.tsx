/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Header } from "./components/layout/Header";
import { Hero } from "./components/layout/Hero";
import { MainContainer } from "./components/layout/MainContainer";
import { QRCodePreview } from "./components/preview/QRCodePreview";
import { OptionsPanel } from "./components/options/OptionsPanel";
import { PresetsGallery } from "./components/presets/PresetsGallery";
import { SavedCodes } from "./components/presets/SavedCodes";
import { useLanguageStore } from "./store/useLanguageStore";
import { translations } from "./lib/translations";

export default function App() {
  const { language } = useLanguageStore();
  const t = translations[language].footer;

  return (
    <div className="min-h-screen bg-[#f4f6f9] dark:bg-slate-950 transition-colors">
      <Header />
      <Hero />
      <MainContainer 
        preview={<QRCodePreview />}
        options={<OptionsPanel />}
      />
      <PresetsGallery />
      <SavedCodes />
      <footer className="py-12 text-center text-slate-600 dark:text-slate-400 text-sm border-t border-slate-200 dark:border-slate-800 mt-12 bg-white dark:bg-slate-900 transition-colors">
        <div className="container mx-auto px-4">
          <p className="mb-2">{t.contact}</p>
          <p className="font-medium">{t.brand}</p>
        </div>
      </footer>
    </div>
  );
}





