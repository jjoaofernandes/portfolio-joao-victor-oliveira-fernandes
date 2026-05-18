import { Options, DotType, CornerSquareType, CornerDotType } from "qr-code-styling";

export type QRCodeOptions = Options;

export type ContentType = 'url' | 'text' | 'wifi' | 'email' | 'phone' | 'sms' | 'vcard';

export interface ContentData {
  type: ContentType;
  url?: string;
  text?: string;
  wifi?: {
    ssid: string;
    password?: string;
    encryption: 'WPA' | 'WEP' | 'nopass';
    hidden?: boolean;
  };
  email?: {
    address: string;
    subject?: string;
    body?: string;
  };
  phone?: string;
  sms?: {
    phone: string;
    message?: string;
  };
  vcard?: {
    firstName: string;
    lastName: string;
    organization?: string;
    phone?: string;
    email?: string;
    address?: string;
    website?: string;
  };
}

export interface QRCodeState {
  options: QRCodeOptions;
  content: ContentData;
  setOptions: (options: Partial<QRCodeOptions>) => void;
  setContent: (content: Partial<ContentData>) => void;
  resetOptions: () => void;
  applyPreset: (options: Partial<QRCodeOptions>) => void;
}

export const defaultContent: ContentData = {
  type: 'url',
  url: "https://qr-code-styling.com",
};

export const defaultOptions: QRCodeOptions = {
  width: 300,
  height: 300,
  data: "https://qr-code-styling.com",
  margin: 0,
  qrOptions: {
    typeNumber: 0,
    mode: "Byte",
    errorCorrectionLevel: "Q",
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 0,
  },
  dotsOptions: {
    type: "rounded" as DotType,
    color: "#6a1b9a",
  },
  backgroundOptions: {
    color: "#ffffff",
  },
  cornersSquareOptions: {
    type: "extra-rounded" as CornerSquareType,
    color: "#4a148c",
  },
  cornersDotOptions: {
    type: "dot" as CornerDotType,
    color: "#4a148c",
  },
};

