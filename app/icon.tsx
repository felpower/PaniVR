import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#06141a', color: '#c8ff3d', border: '4px solid #c8ff3d', fontSize: 32, fontWeight: 800 }}>P</div>, size);
}
