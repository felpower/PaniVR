import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#071018', color: '#2f6eb5', border: '4px solid #2f6eb5', fontSize: 25, fontWeight: 900, letterSpacing: '-3px' }}>VR</div>, size);
}
