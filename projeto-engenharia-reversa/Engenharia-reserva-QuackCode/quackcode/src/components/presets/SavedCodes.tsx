import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useFirebase } from "../FirebaseProvider";
import { useQRCodeStore } from "../../store/useQRCodeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../lib/translations";
import { motion } from "motion/react";
import { Trash2, ExternalLink, Clock } from "lucide-react";
import { deleteDoc, doc } from "firebase/firestore";

export function SavedCodes() {
  const { user } = useFirebase();
  const { applyPreset } = useQRCodeStore();
  const { language } = useLanguageStore();
  const t = translations[language].auth;
  
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCodes([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "users", user.uid, "qrcodes"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const codesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCodes(codesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching codes:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "qrcodes", id));
    } catch (error) {
      console.error("Error deleting code:", error);
    }
  };

  if (!user || (codes.length === 0 && !loading)) return null;

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {language === 'pt' ? 'Meus QR Codes Salvos' : language === 'es' ? 'Mis QR Codes Guardados' : 'My Saved QR Codes'}
          </h2>
          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-bold">
            {codes.length}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {codes.map((code) => (
              <motion.div
                key={code.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                      {code.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <Clock className="w-3 h-3" />
                      {code.createdAt?.toDate().toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(code.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 mb-4 flex items-center justify-center aspect-square border border-slate-100 dark:border-slate-700">
                   {/* Simple preview or just icon */}
                   <div className="text-blue-500 opacity-20 group-hover:opacity-40 transition-opacity">
                     <svg viewBox="0 0 24 24" className="w-16 h-16 fill-current">
                       <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v3h-2v-3zm3 3h3v2h-3v-2zm-3 3h2v2h-2v-2zm3-3h2v2h-2v-2zm-3 3h2v2h-2v-2zm3 0h3v3h-3v-3z" />
                     </svg>
                   </div>
                </div>

                <button
                  onClick={() => applyPreset(code.options)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  {language === 'pt' ? 'Carregar' : language === 'es' ? 'Cargar' : 'Load'}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
