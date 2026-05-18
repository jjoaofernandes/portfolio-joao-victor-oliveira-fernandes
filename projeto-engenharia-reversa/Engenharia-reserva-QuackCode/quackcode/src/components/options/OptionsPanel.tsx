import React, { useState } from "react";
import { useQRCodeStore } from "../../store/useQRCodeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../lib/translations";
import { Plus, Minus, Upload, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useFirebase } from "../FirebaseProvider";
import { uploadLogo } from "../../lib/firebase";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function Section({ title, children, isOpen, onToggle }: SectionProps) {
  return (
    <div className="border-b border-slate-200 dark:border-slate-800 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-[#ddd] dark:bg-slate-800 hover:bg-[#ccc] dark:hover:bg-slate-700 transition-colors text-left"
      >
        <span className="font-medium text-slate-800 dark:text-slate-200">{title}</span>
        <div className="text-slate-600 dark:text-slate-400">
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>
      {isOpen && <div className="p-6 space-y-6 bg-white dark:bg-slate-900 transition-colors">{children}</div>}
    </div>
  );
}

export function OptionsPanel() {
  const { options, content, setOptions, setContent } = useQRCodeStore();
  const { language } = useLanguageStore();
  const { user } = useFirebase();
  const t = translations[language];
  const [openSection, setOpenSection] = useState<string | null>("main");
  const [isUploading, setIsUploading] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleOptionChange = (path: string, value: any) => {
    const keys = path.split('.');
    if (keys.length === 1) {
      setOptions({ [keys[0]]: value });
    } else {
      const parentKey = keys[0];
      const childKey = keys[1];
      const currentParent = (options as any)[parentKey] || {};
      setOptions({
        [parentKey]: {
          ...currentParent,
          [childKey]: value
        }
      });
    }
  };

  const handleContentChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const currentParent = (content as any)[parent] || {};
      setContent({
        [parent]: {
          ...currentParent,
          [child]: value
        }
      });
    } else {
      setContent({ [field]: value });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (user) {
      // Use Firebase Storage if logged in
      setIsUploading(true);
      try {
        const url = await uploadLogo(user.uid, file);
        handleOptionChange('image', url);
      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        setIsUploading(false);
      }
    } else {
      // Fallback to local FileReader if not logged in
      const reader = new FileReader();
      reader.onload = (event) => {
        handleOptionChange('image', event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderContentFields = () => {
    switch (content.type) {
      case 'url':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">URL</label>
            <div className="md:col-span-2">
              <input 
                type="url" 
                value={content.url || ''}
                onChange={(e) => handleContentChange('url', e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 pt-2">{t.labels.data}</label>
            <div className="md:col-span-2">
              <textarea 
                value={content.text || ''}
                onChange={(e) => handleContentChange('text', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none min-h-[80px] transition-colors"
              />
            </div>
          </div>
        );
      case 'wifi':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.wifi.ssid}</label>
              <div className="md:col-span-2">
                <input 
                  type="text" 
                  value={content.wifi?.ssid || ''}
                  onChange={(e) => handleContentChange('wifi.ssid', e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.wifi.password}</label>
              <div className="md:col-span-2">
                <input 
                  type="text" 
                  value={content.wifi?.password || ''}
                  onChange={(e) => handleContentChange('wifi.password', e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.wifi.encryption}</label>
              <div className="md:col-span-2">
                <select 
                  value={content.wifi?.encryption || 'WPA'}
                  onChange={(e) => handleContentChange('wifi.encryption', e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none transition-colors"
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 'email':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.email.address}</label>
              <div className="md:col-span-2">
                <input 
                  type="email" 
                  value={content.email?.address || ''}
                  onChange={(e) => handleContentChange('email.address', e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.email.subject}</label>
              <div className="md:col-span-2">
                <input 
                  type="text" 
                  value={content.email?.subject || ''}
                  onChange={(e) => handleContentChange('email.subject', e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 pt-2">{t.labels.email.body}</label>
              <div className="md:col-span-2">
                <textarea 
                  value={content.email?.body || ''}
                  onChange={(e) => handleContentChange('email.body', e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none min-h-[80px] transition-colors"
                />
              </div>
            </div>
          </div>
        );
      case 'phone':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.phone}</label>
            <div className="md:col-span-2">
              <input 
                type="tel" 
                value={content.phone || ''}
                onChange={(e) => handleContentChange('phone', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>
        );
      case 'sms':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.sms.phone}</label>
              <div className="md:col-span-2">
                <input 
                  type="tel" 
                  value={content.sms?.phone || ''}
                  onChange={(e) => handleContentChange('sms.phone', e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 pt-2">{t.labels.sms.message}</label>
              <div className="md:col-span-2">
                <textarea 
                  value={content.sms?.message || ''}
                  onChange={(e) => handleContentChange('sms.message', e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none min-h-[80px] transition-colors"
                />
              </div>
            </div>
          </div>
        );
      case 'vcard':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.vcard.firstName}</label>
              <div className="md:col-span-2">
                <input 
                  type="text" 
                  value={content.vcard?.firstName || ''}
                  onChange={(e) => handleContentChange('vcard.firstName', e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.vcard.lastName}</label>
              <div className="md:col-span-2">
                <input 
                  type="text" 
                  value={content.vcard?.lastName || ''}
                  onChange={(e) => handleContentChange('vcard.lastName', e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.vcard.organization}</label>
              <div className="md:col-span-2">
                <input 
                  type="text" 
                  value={content.vcard?.organization || ''}
                  onChange={(e) => handleContentChange('vcard.organization', e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.vcard.phone}</label>
              <div className="md:col-span-2">
                <input 
                  type="tel" 
                  value={content.vcard?.phone || ''}
                  onChange={(e) => handleContentChange('vcard.phone', e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.vcard.email}</label>
              <div className="md:col-span-2">
                <input 
                  type="email" 
                  value={content.vcard?.email || ''}
                  onChange={(e) => handleContentChange('vcard.email', e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.vcard.address}</label>
              <div className="md:col-span-2">
                <input 
                  type="text" 
                  value={content.vcard?.address || ''}
                  onChange={(e) => handleContentChange('vcard.address', e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.vcard.website}</label>
              <div className="md:col-span-2">
                <input 
                  type="url" 
                  value={content.vcard?.website || ''}
                  onChange={(e) => handleContentChange('vcard.website', e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col">
      <Section 
        title={t.sections.main} 
        isOpen={openSection === "main"} 
        onToggle={() => toggleSection("main")}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.contentType}</label>
            <div className="md:col-span-2">
              <select 
                value={content.type}
                onChange={(e) => handleContentChange('type', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none transition-colors"
              >
                <option value="url">{t.labels.types.url}</option>
                <option value="text">{t.labels.types.text}</option>
                <option value="wifi">{t.labels.types.wifi}</option>
                <option value="email">{t.labels.types.email}</option>
                <option value="phone">{t.labels.types.phone}</option>
                <option value="sms">{t.labels.types.sms}</option>
                <option value="vcard">{t.labels.types.vcard}</option>
              </select>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
            {renderContentFields()}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.imageFile}</label>
              <div className="md:col-span-2 flex gap-2">
                <input 
                  type="file" 
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  accept="image/*"
                />
                <label 
                  htmlFor="image-upload"
                  className={`px-4 py-2 bg-[#ddd] dark:bg-slate-800 hover:bg-[#ccc] dark:hover:bg-slate-700 rounded cursor-pointer text-sm font-medium transition-colors text-slate-800 dark:text-slate-200 flex items-center gap-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {t.labels.chooseFile}
                </label>
                <Button 
                  variant="ghost" 
                  onClick={() => handleOptionChange('image', '')}
                  className="bg-[#ddd] dark:bg-slate-800 hover:bg-[#ccc] dark:hover:bg-slate-700 rounded px-4 h-9 text-slate-800 dark:text-slate-200"
                >
                  {t.labels.cancel}
                </Button>
              </div>
            </div>

            {[
              { label: t.labels.width, path: 'width' },
              { label: t.labels.height, path: 'height' },
              { label: t.labels.margin, path: 'margin' }
            ].map((item) => (
              <div key={item.path} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</label>
                <div className="md:col-span-2">
                  <input 
                    type="number" 
                    value={(options as any)[item.path]}
                    onChange={(e) => handleOptionChange(item.path, parseInt(e.target.value))}
                    className="w-32 px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>


      <Section 
        title={t.sections.dots} 
        isOpen={openSection === "dots"} 
        onToggle={() => toggleSection("dots")}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.color}</label>
            <div className="md:col-span-2">
              <input 
                type="color" 
                value={options.dotsOptions?.color}
                onChange={(e) => handleOptionChange('dotsOptions.color', e.target.value)}
                className="w-full h-10 rounded cursor-pointer bg-transparent border-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.type}</label>
            <div className="md:col-span-2">
              <select 
                value={options.dotsOptions?.type}
                onChange={(e) => handleOptionChange('dotsOptions.type', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none transition-colors"
              >
                <option value="rounded">Rounded</option>
                <option value="square">Square</option>
                <option value="extra-rounded">Extra Rounded</option>
                <option value="dots">Dots</option>
                <option value="classy">Classy</option>
                <option value="classy-rounded">Classy Rounded</option>
              </select>
            </div>
          </div>
        </div>
      </Section>

      <Section 
        title={t.sections.cornersSquare} 
        isOpen={openSection === "cornersSquare"} 
        onToggle={() => toggleSection("cornersSquare")}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.color}</label>
            <div className="md:col-span-2">
              <input 
                type="color" 
                value={options.cornersSquareOptions?.color}
                onChange={(e) => handleOptionChange('cornersSquareOptions.color', e.target.value)}
                className="w-full h-10 rounded cursor-pointer bg-transparent border-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.type}</label>
            <div className="md:col-span-2">
              <select 
                value={options.cornersSquareOptions?.type}
                onChange={(e) => handleOptionChange('cornersSquareOptions.type', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none transition-colors"
              >
                <option value="square">Square</option>
                <option value="extra-rounded">Extra Rounded</option>
                <option value="dot">Dot</option>
              </select>
            </div>
          </div>
        </div>
      </Section>

      <Section 
        title={t.sections.cornersDot} 
        isOpen={openSection === "cornersDot"} 
        onToggle={() => toggleSection("cornersDot")}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.color}</label>
            <div className="md:col-span-2">
              <input 
                type="color" 
                value={options.cornersDotOptions?.color}
                onChange={(e) => handleOptionChange('cornersDotOptions.color', e.target.value)}
                className="w-full h-10 rounded cursor-pointer bg-transparent border-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.type}</label>
            <div className="md:col-span-2">
              <select 
                value={options.cornersDotOptions?.type}
                onChange={(e) => handleOptionChange('cornersDotOptions.type', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none transition-colors"
              >
                <option value="dot">Dot</option>
                <option value="square">Square</option>
              </select>
            </div>
          </div>
        </div>
      </Section>

      <Section 
        title={t.sections.background} 
        isOpen={openSection === "background"} 
        onToggle={() => toggleSection("background")}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.color}</label>
            <div className="md:col-span-2">
              <input 
                type="color" 
                value={options.backgroundOptions?.color}
                onChange={(e) => handleOptionChange('backgroundOptions.color', e.target.value)}
                className="w-full h-10 rounded cursor-pointer bg-transparent border-none"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section 
        title={t.sections.image} 
        isOpen={openSection === "imageOptions"} 
        onToggle={() => toggleSection("imageOptions")}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.imageMargin}</label>
            <div className="md:col-span-2">
              <input 
                type="number" 
                value={options.imageOptions?.margin}
                onChange={(e) => handleOptionChange('imageOptions.margin', parseInt(e.target.value))}
                className="w-32 px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.imageSize}</label>
            <div className="md:col-span-2">
              <input 
                type="number" 
                step="0.1"
                min="0.1"
                max="1"
                value={options.imageOptions?.imageSize}
                onChange={(e) => handleOptionChange('imageOptions.imageSize', parseFloat(e.target.value))}
                className="w-32 px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section 
        title={t.sections.qr} 
        isOpen={openSection === "qrOptions"} 
        onToggle={() => toggleSection("qrOptions")}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.errorCorrection}</label>
            <div className="md:col-span-2">
              <select 
                value={options.qrOptions?.errorCorrectionLevel}
                onChange={(e) => handleOptionChange('qrOptions.errorCorrectionLevel', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none transition-colors"
              >
                <option value="L">L (7%)</option>
                <option value="M">M (15%)</option>
                <option value="Q">Q (25%)</option>
                <option value="H">H (30%)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.labels.maskType}</label>
            <div className="md:col-span-2">
              <input 
                type="number" 
                min="0"
                max="7"
                value={options.qrOptions?.typeNumber}
                onChange={(e) => handleOptionChange('qrOptions.typeNumber', parseInt(e.target.value))}
                className="w-32 px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </Section>

      <div className="border-t border-slate-200 dark:border-slate-800">
        <button 
          className="w-full p-4 bg-[#ddd] dark:bg-slate-800 hover:bg-[#ccc] dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-left transition-colors"
          onClick={() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(options));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "qr-options.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
          }}
        >
          {t.sections.exportJson}
        </button>
      </div>
    </div>
  );
}



