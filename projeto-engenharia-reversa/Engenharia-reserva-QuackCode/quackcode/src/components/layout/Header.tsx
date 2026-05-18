import { useState, useEffect } from "react";
import { Zap, Globe, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useLanguageStore } from "../../store/useLanguageStore";
import { Language, translations } from "../../lib/translations";
import { ThemeToggle } from "./ThemeToggle";
import { useFirebase } from "../FirebaseProvider";
import { signInWithGoogle, logout, getRemoteConfigValue } from "../../lib/firebase";

export function Header() {
  const { language, setLanguage } = useLanguageStore();
  const { user } = useFirebase();
  const t = translations[language].auth;
  const [githubUrl, setGithubUrl] = useState("https://github.com/mgj240819/QuackCode");

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const url = await getRemoteConfigValue("github_url");
        if (url) setGithubUrl(url);
      } catch (error) {
        console.error("Remote config error:", error);
      }
    };
    fetchConfig();
  }, []);

  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          {/* Simple Duck Logo from Sketch */}
          <div className="flex h-12 w-12 items-center justify-center">
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Body */}
              <path d="M30,60 Q30,40 50,40 Q70,40 80,60 Q85,75 70,80 Q50,85 30,75 Q20,70 30,60" fill="#FFEB3B" />
              {/* Head */}
              <circle cx="40" cy="45" r="15" fill="#FFEB3B" />
              {/* Eye */}
              <circle cx="45" cy="42" r="2" fill="black" />
              {/* Beak */}
              <path d="M25,45 Q15,45 15,50 Q25,55 30,50" fill="#FF9800" />
              {/* Legs */}
              <path d="M50,82 L50,90 M60,82 L60,90" stroke="#795548" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex items-center text-3xl font-bold tracking-tight">
            <span className="text-black dark:text-white">Quack</span>
            <span className="text-[#FFEB3B] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.2)]">Code</span>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-1 gap-1">
            {(['en', 'pt', 'es'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1 rounded-full text-xs uppercase transition-all ${
                  language === lang 
                    ? 'bg-white dark:bg-slate-700 text-black dark:text-white shadow-sm font-bold' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ""} className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                  <span className="hidden lg:block max-w-[100px] truncate">{user.displayName}</span>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-red-500"
                  title={t.logout}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm font-semibold"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">{t.login}</span>
              </button>
            )}
          </div>

          <ThemeToggle />
          
          <a href={githubUrl} target="_blank" rel="noreferrer" className="hidden sm:block hover:text-black dark:hover:text-white transition-colors">
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}







