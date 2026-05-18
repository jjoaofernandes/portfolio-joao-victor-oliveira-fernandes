import { useState } from "react";
import { Button } from "../ui/button";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../lib/translations";

interface DownloadButtonsProps {
  onDownload: (extension: "png" | "svg" | "jpeg" | "webp") => void;
}

export function DownloadButtons({ onDownload }: DownloadButtonsProps) {
  const { language } = useLanguageStore();
  const t = translations[language].labels;
  const [extension, setExtension] = useState<"png" | "svg" | "jpeg" | "webp">("png");

  return (
    <div className="flex items-center mt-6">
      <div className="flex rounded-md shadow-sm">
        <Button 
          onClick={() => onDownload(extension)}
          className="rounded-r-none bg-[#ddd] dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-[#ccc] dark:hover:bg-slate-600 border-r border-slate-300 dark:border-slate-600 px-6 h-10 transition-colors"
        >
          {t.download}
        </Button>
        <select
          value={extension}
          onChange={(e) => setExtension(e.target.value as any)}
          className="rounded-l-none bg-[#ddd] dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-[#ccc] dark:hover:bg-slate-600 border-none px-3 h-10 outline-none cursor-pointer font-medium text-sm uppercase transition-colors"
        >
          <option value="png">PNG</option>
          <option value="svg">SVG</option>
          <option value="jpeg">JPEG</option>
          <option value="webp">WEBP</option>
        </select>
      </div>
    </div>
  );
}


