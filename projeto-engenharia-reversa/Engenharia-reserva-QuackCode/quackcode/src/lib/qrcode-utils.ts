import { ContentData } from "../types/qrcode";

export function formatQRCodeData(content: ContentData): string {
  switch (content.type) {
    case 'url':
      return content.url || '';
    case 'text':
      return content.text || '';
    case 'wifi':
      const { ssid, password, encryption, hidden } = content.wifi || {};
      return `WIFI:S:${ssid || ''};T:${encryption || 'WPA'};P:${password || ''};H:${hidden ? 'true' : 'false'};;`;
    case 'email':
      const { address, subject, body } = content.email || {};
      return `MATMSG:TO:${address || ''};SUB:${subject || ''};BODY:${body || ''};;`;
    case 'phone':
      return `tel:${content.phone || ''}`;
    case 'sms':
      const { phone, message } = content.sms || {};
      return `SMSTO:${phone || ''}:${message || ''}`;
    case 'vcard':
      const v = content.vcard || ({} as any);
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${v.lastName || ''};${v.firstName || ''};;;`,
        `FN:${v.firstName || ''} ${v.lastName || ''}`,
        v.organization ? `ORG:${v.organization}` : '',
        v.phone ? `TEL;TYPE=CELL:${v.phone}` : '',
        v.email ? `EMAIL:${v.email}` : '',
        v.address ? `ADR;TYPE=WORK:;;${v.address};;;;` : '',
        v.website ? `URL:${v.website}` : '',
        'END:VCARD'
      ].filter(Boolean).join('\n');
    default:
      return '';
  }
}
