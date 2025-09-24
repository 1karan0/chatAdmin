"use client";

import { TrendingUp } from 'lucide-react';
import { UsageStat } from '@/types';

interface UsageCardProps {
  stat: UsageStat;
}

export default function UsageCard({ stat }: UsageCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red':
        return 'text-red-400 bg-red-500';
      case 'blue':
        return 'text-blue-400 bg-blue-500';
      case 'green':
        return 'text-green-400 bg-green-500';
      case 'blue':
        return 'text-blue-400 bg-blue-500';
      default:
        return 'text-zinc-400 bg-zinc-500';
    }
  };

  const colorClasses = getColorClasses(stat.color);
  const [textColor, bgColor] = colorClasses.split(' ');

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-zinc-400">{stat.label}</span>
        <TrendingUp className={`w-4 h-4 ${textColor}`} />
      </div>
      
      <div className="mb-3">
        <div className="text-lg font-bold text-white">
          {stat.unit === '$' ? `$${stat.value.toFixed(2)}` : 
           stat.unit === 'kB' ? `${stat.value.toFixed(1)}${stat.unit}` : 
           Math.round(stat.value)}
        </div>
        <div className="text-xs text-zinc-500">
          of {stat.unit === '$' ? `$${stat.max.toFixed(2)}` : 
              stat.unit === 'kB' ? `${stat.max}${stat.unit}` : 
              stat.max}
        </div>
      </div>
      
      <div className="w-full bg-zinc-700 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${bgColor}`}
          style={{ width: `${Math.min(stat.percentage, 100)}%` }}
        />
      </div>
      
      <div className="text-xs text-zinc-500">
        {stat.percentage.toFixed(1)}% used
      </div>
    </div>
  );
}