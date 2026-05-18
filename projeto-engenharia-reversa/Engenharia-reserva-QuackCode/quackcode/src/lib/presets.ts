import { QRCodeOptions } from "../types/qrcode";

export interface Preset {
  id: string;
  name: {
    en: string;
    pt: string;
    es: string;
  };
  options: Partial<QRCodeOptions>;
}

export const presets: Preset[] = [
  {
    id: "classic",
    name: {
      en: "Classic",
      pt: "Clássico",
      es: "Clásico"
    },
    options: {
      dotsOptions: { type: "square", color: "#000000" },
      cornersSquareOptions: { type: "square", color: "#000000" },
      cornersDotOptions: { type: "square", color: "#000000" },
      backgroundOptions: { color: "#ffffff" }
    }
  },
  {
    id: "modern-purple",
    name: {
      en: "Modern Purple",
      pt: "Roxo Moderno",
      es: "Púrpura Moderno"
    },
    options: {
      dotsOptions: { type: "rounded", color: "#6a1b9a" },
      cornersSquareOptions: { type: "extra-rounded", color: "#4a148c" },
      cornersDotOptions: { type: "dot", color: "#4a148c" },
      backgroundOptions: { color: "#ffffff" }
    }
  },
  {
    id: "ocean-blue",
    name: {
      en: "Ocean Blue",
      pt: "Azul Oceano",
      es: "Azul Océano"
    },
    options: {
      dotsOptions: { type: "dots", color: "#006064" },
      cornersSquareOptions: { type: "extra-rounded", color: "#00838f" },
      cornersDotOptions: { type: "dot", color: "#0097a7" },
      backgroundOptions: { color: "#e0f7fa" }
    }
  },
  {
    id: "sunset-orange",
    name: {
      en: "Sunset Orange",
      pt: "Laranja Pôr do Sol",
      es: "Naranja Atardecer"
    },
    options: {
      dotsOptions: { type: "classy", color: "#e65100" },
      cornersSquareOptions: { type: "extra-rounded", color: "#ef6c00" },
      cornersDotOptions: { type: "dot", color: "#f57c00" },
      backgroundOptions: { color: "#fff3e0" }
    }
  },
  {
    id: "forest-green",
    name: {
      en: "Forest Green",
      pt: "Verde Floresta",
      es: "Verde Bosque"
    },
    options: {
      dotsOptions: { type: "rounded", color: "#1b5e20" },
      cornersSquareOptions: { type: "square", color: "#2e7d32" },
      cornersDotOptions: { type: "dot", color: "#388e3c" },
      backgroundOptions: { color: "#e8f5e9" }
    }
  },
  {
    id: "elegant-gold",
    name: {
      en: "Elegant Gold",
      pt: "Ouro Elegante",
      es: "Oro Elegante"
    },
    options: {
      dotsOptions: { type: "classy-rounded", color: "#bf953f" },
      cornersSquareOptions: { type: "extra-rounded", color: "#aa771c" },
      cornersDotOptions: { type: "dot", color: "#8a6e2f" },
      backgroundOptions: { color: "#fcfaf2" }
    }
  },
  {
    id: "cyber-neon",
    name: {
      en: "Cyber Neon",
      pt: "Cyber Neon",
      es: "Ciber Neón"
    },
    options: {
      dotsOptions: { type: "dots", color: "#00ff41" },
      cornersSquareOptions: { type: "square", color: "#00ff41" },
      cornersDotOptions: { type: "square", color: "#00ff41" },
      backgroundOptions: { color: "#0d0208" }
    }
  },
  {
    id: "soft-pink",
    name: {
      en: "Soft Pink",
      pt: "Rosa Suave",
      es: "Rosa Suave"
    },
    options: {
      dotsOptions: { type: "rounded", color: "#ad1457" },
      cornersSquareOptions: { type: "extra-rounded", color: "#c2185b" },
      cornersDotOptions: { type: "dot", color: "#d81b60" },
      backgroundOptions: { color: "#fce4ec" }
    }
  }
];
