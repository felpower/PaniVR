import Image from 'next/image';
import { brand } from '@/lib/brand';

type BrandIdentityProps = {
  className?: string;
  showName?: boolean;
};

export function BrandIdentity({ className = '', showName = true }: BrandIdentityProps) {
  return (
    <span className={`brand-identity ${className}`.trim()}>
      <Image
        className="brand-logo-image"
        src="/vr-virtual-raiders-logo.jpeg"
        width={640}
        height={640}
        alt=""
        aria-hidden="true"
        sizes="64px"
      />
      {showName && <span className="brand-wordmark">Virtual <strong>Raiders</strong></span>}
      <span className="sr-only">{brand.name}</span>
    </span>
  );
}
