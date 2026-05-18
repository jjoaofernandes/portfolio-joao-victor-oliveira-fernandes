import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { useQRCodeStore } from "../../store/useQRCodeStore";
import { DownloadButtons } from "./DownloadButtons";
import { useFirebase } from "../FirebaseProvider";
import { saveQRCode } from "../../lib/firebase";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../lib/translations";
import { Save, Check, AlertCircle, Loader2 } from "lucide-react";

export function QRCodePreview() {
  const { options } = useQRCodeStore();
  const { language } = useLanguageStore();
  const { user } = useFirebase();
  const t = translations[language].auth;
  
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling(options);
      if (containerRef.current) {
        qrCodeRef.current.append(containerRef.current);
      }
    } else {
      qrCodeRef.current.update(options);
    }
  }, [options]);

  const handleDownload = (extension: "png" | "svg" | "jpeg" | "webp") => {
    if (qrCodeRef.current) {
      qrCodeRef.current.download({
        name: "qr-code",
        extension: extension,
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaveStatus('saving');
    try {
      const name = options.data.substring(0, 20) || "My QR Code";
      await saveQRCode(user.uid, name, options.data, options);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error("Save error:", error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="bg-white dark:bg-slate-800 p-4 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 transition-colors rounded-lg">
        <div ref={containerRef} className="qr-code-wrapper" />
      </div>

      <div className="w-full flex flex-col gap-4">
        <DownloadButtons onDownload={handleDownload} />
        
        {user && (
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all shadow-sm ${
              saveStatus === 'saved' 
                ? 'bg-green-500 text-white' 
                : saveStatus === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {saveStatus === 'saving' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : saveStatus === 'saved' ? (
              <Check className="w-5 h-5" />
            ) : saveStatus === 'error' ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saveStatus === 'saved' ? t.saved : saveStatus === 'error' ? t.error : t.save}
          </button>
        )}
      </div>
    </div>
  );
}

