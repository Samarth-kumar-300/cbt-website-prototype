import Image from 'next/image';

export function Logo({ className = '' }: { className?: string }) {
  return <Image src="/brand/logo.svg" alt="CognitiveBotics" fill priority className={`object-contain object-left ${className}`} />;
}
