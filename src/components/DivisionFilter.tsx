'use client';

import { DivisionFilter as DivFilterType } from '@/lib/types';

interface Props {
  value: DivFilterType;
  onChange: (div: DivFilterType) => void;
  showAll?: boolean;
}

const OPTIONS: { value: DivFilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: '18+', label: '18+' },
  { value: '28+', label: '28+' },
  { value: '35+', label: '35+' },
];

export default function DivisionFilter({ value, onChange, showAll = true }: Props) {
  const items = showAll ? OPTIONS : OPTIONS.filter(o => o.value !== 'all');

  return (
    <div className="div-filter">
      {items.map(opt => (
        <button
          key={opt.value}
          className={`div-filter-btn ${value === opt.value ? 'active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label} Division
        </button>
      ))}
    </div>
  );
}
