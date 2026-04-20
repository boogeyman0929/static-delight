type Props = { className?: string; size?: number };

export const TelegramIcon = ({ className, size = 18 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21.5 3.5L2.5 10.5l6 2.5 2 6.5 3.5-4 5.5 4z" />
    <path d="M8.5 13l9.5-7" />
  </svg>
);

export const ArrowLeftIcon = ({ className, size = 18 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

export const SoundOnIcon = ({ className, size = 18 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 5L6 9H2v6h4l5 4z" />
    <path d="M15.5 8.5a5 5 0 010 7" />
    <path d="M18.5 5.5a9 9 0 010 13" />
  </svg>
);

export const SoundOffIcon = ({ className, size = 18 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 5L6 9H2v6h4l5 4z" />
    <path d="M22 9l-6 6" />
    <path d="M16 9l6 6" />
  </svg>
);

export const ShieldIcon = ({ className, size = 18 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const SparkIcon = ({ className, size = 12 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2l1.8 7.2L21 11l-7.2 1.8L12 20l-1.8-7.2L3 11l7.2-1.8z" />
  </svg>
);
