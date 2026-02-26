import React from 'react';

interface PriceDisplayProps {
  currentPrice: number;
  type?: string; // 'solo' or 'couple'
  className?: string;
  isSmall?: boolean;
}

export default function PriceDisplay({ currentPrice, type, className = "", isSmall = false }: PriceDisplayProps) {
  // Hardcoded old prices based on pass type
  const oldPrice = type === 'couple' ? 250 : 150;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`text-white/40 line-through font-medium ${isSmall ? 'text-xs' : 'text-lg md:text-xl'}`}>
        ₹{oldPrice}
      </span>
      <span className={`text-white font-bold ${isSmall ? 'text-sm' : 'text-2xl md:text-3xl'}`}>
        ₹{currentPrice}
      </span>
    </div>
  );
}