import { useEffect, useState } from "react";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../lib/translations";
import { getRemoteConfigValue } from "../../lib/firebase";

export function Hero() {
  const { language } = useLanguageStore();
  const t = translations[language].hero;
  const [welcomeMsg, setWelcomeMsg] = useState("");

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const msg = await getRemoteConfigValue("welcome_message");
        setWelcomeMsg(msg);
      } catch (error) {
        console.error("Remote config error:", error);
      }
    };
    fetchConfig();
  }, []);

  return (
    <section className="w-full bg-gradient-to-r from-black via-[#ca8a04] to-[#fefce8] dark:from-black dark:via-[#854d0e] dark:to-slate-900 py-16 transition-colors">
      <div className="container mx-auto px-4 md:px-8">
        {welcomeMsg && (
          <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-200 text-xs font-bold rounded-full mb-4 backdrop-blur-sm border border-blue-500/30">
            {welcomeMsg}
          </div>
        )}
        <h1 className="text-5xl font-bold mb-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{t.title}</h1>
        <p className="text-2xl mb-2 font-light text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{t.subtitle1}</p>
        <p className="text-2xl font-light text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{t.subtitle2}</p>
      </div>
    </section>
  );
}



