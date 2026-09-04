import { brand, siteUrl } from './brand';

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character] || character));
}

export function confirmationEmail(input: { name: string; date: string; slot: string; players: number; occasion: string; reference: string }) {
  const name = escapeHtml(input.name || 'dort');
  const readableDate = new Intl.DateTimeFormat('de-AT', { dateStyle: 'full' }).format(new Date(`${input.date}T12:00:00`));
  const date = escapeHtml(readableDate);
  const slot = escapeHtml(input.slot);
  const occasion = escapeHtml(input.occasion || 'VR-Erlebnis');
  const reference = escapeHtml(input.reference);
  const logo = `${siteUrl.replace(/\/$/, '')}/vr-virtual-raiders-logo.jpeg`;
  return {
    subject: `Bestätigt: Eure VR-Reservierung am ${readableDate}`,
    text: `Hallo ${input.name},\n\nEure Reservierung bei ${brand.name} ist bestätigt!\n\n${readableDate}\n${input.slot} Uhr · ${input.players} Personen\nAnlass: ${input.occasion || 'VR-Erlebnis'}\nReservierungsnummer: ${input.reference}\n\n${brand.address.street}, ${brand.address.postalCode} ${brand.address.city}\n${brand.phoneDisplay}\n\nWir freuen uns auf euch!\n\n${brand.name}`,
    html: `<!doctype html><html lang="de"><body style="margin:0;background:#0b1020;font-family:Arial,sans-serif;color:#18213a"><div style="max-width:620px;margin:0 auto;padding:28px 14px"><div style="background:linear-gradient(135deg,#7357ff,#2454a6);border-radius:22px 22px 0 0;padding:30px 28px;color:#fff"><img src="${logo}" alt="${brand.name}" style="display:block;max-width:230px;max-height:64px;width:auto;height:auto;object-fit:contain;margin-bottom:20px"><p style="margin:0 0 8px;text-transform:uppercase;letter-spacing:2px;font-size:11px;opacity:.8">Reservierung bestätigt</p><h1 style="margin:0;font-size:28px;line-height:1.15">Eure Mission ist gebucht.</h1></div><div style="background:#fff;border-radius:0 0 22px 22px;padding:28px"><p style="font-size:17px;margin:0 0 22px">Hallo ${name},</p><p style="margin:0 0 22px;line-height:1.6">eure Reservierung bei <strong>${brand.name}</strong> wurde manuell bestätigt. Wir freuen uns auf euch!</p><div style="background:#f3f5ff;border:1px solid #e2e6ff;border-radius:16px;padding:20px;margin:0 0 22px"><p style="margin:0 0 12px;color:#667099;font-size:12px;text-transform:uppercase;letter-spacing:1.4px;font-weight:bold">Euer Termin</p><p style="margin:0;font-size:20px;font-weight:bold;color:#2454a6">${date}</p><p style="margin:7px 0 0;font-size:18px;font-weight:bold">${slot} Uhr <span style="font-size:14px;font-weight:normal;color:#667099">· ${input.players} Personen</span></p><p style="margin:10px 0 0;color:#667099">${occasion}</p></div><table role="presentation" style="width:100%;border-collapse:collapse;margin-bottom:22px"><tr><td style="padding:8px 0;color:#667099">Reservierungsnummer</td><td style="padding:8px 0;text-align:right;font-weight:bold">${reference}</td></tr><tr><td style="padding:8px 0;color:#667099">Adresse</td><td style="padding:8px 0;text-align:right">${brand.address.street}<br>${brand.address.postalCode} ${brand.address.city}</td></tr></table><a href="${brand.mapsUrl}" style="display:block;text-align:center;background:#2454a6;color:#fff;text-decoration:none;border-radius:12px;padding:14px 18px;font-weight:bold;margin-bottom:24px">Route zur VR Arena öffnen</a><p style="margin:0;color:#667099;font-size:13px;line-height:1.6">Fragen oder Änderungen? ${brand.phoneDisplay}<br><a href="mailto:${brand.email}" style="color:#2454a6">${brand.email}</a></p></div><p style="color:#8991aa;text-align:center;font-size:11px;margin:18px 0 0">${brand.name} · ${brand.venueName}</p></div></body></html>`,
  };
}
