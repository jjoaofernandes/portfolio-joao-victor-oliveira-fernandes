import { useQRCodeStore } from "../../store/useQRCodeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../lib/translations";
import { presets } from "../../lib/presets";
import { motion } from "motion/react";

export function PresetsGallery() {
  const { applyPreset } = useQRCodeStore();
  const { language } = useLanguageStore();
  const t = translations[language].presets;

  return (
    <section className="py-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t.title}</h2>
          <p className="text-slate-600 dark:text-slate-400">{t.description}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {presets.map((preset) => (
            <motion.button
              key={preset.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => applyPreset(preset.options)}
              className="group flex flex-col items-center p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm hover:shadow-md"
            >
              {/* Preset Preview Box */}
              <div 
                className="w-full aspect-square rounded-lg mb-3 flex items-center justify-center border border-slate-200 dark:border-slate-700"
                style={{ backgroundColor: preset.options.backgroundOptions?.color || '#ffffff' }}
              >
                <div 
                  className="w-1/2 h-1/2 rounded"
                  style={{ backgroundColor: preset.options.dotsOptions?.color || '#000000' }}
                />
              </div>
              
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {preset.name[language]}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
