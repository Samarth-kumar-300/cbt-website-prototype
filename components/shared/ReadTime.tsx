/** "3 min read", shown beside a card's tag. */
export function ReadTime({ minutes, className = '' }: { minutes: number; className?: string }) {
  return <span className={`text-[14px] text-content-secondary ${className}`}>{minutes} min read</span>;
}
