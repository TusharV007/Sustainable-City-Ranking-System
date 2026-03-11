import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  progress: number;
  description?: string;
  reverseProgress?: boolean;
}

export function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  progress,
  description,
  reverseProgress = false,
}: MetricCardProps) {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  const getProgressColor = () => {
    if (reverseProgress) {
      if (clampedProgress > 70) return 'bg-red-500';
      if (clampedProgress > 40) return 'bg-yellow-500';
      return 'bg-green-500';
    } else {
      if (clampedProgress > 70) return 'bg-green-500';
      if (clampedProgress > 40) return 'bg-yellow-500';
      return 'bg-red-500';
    }
  };

  return (
    <Card className="border-0 shadow-md group hover:shadow-lg transition-all overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center group-hover:bg-green-50 transition-colors">
            <Icon className="w-6 h-6 text-zinc-400 group-hover:text-green-600 transition-colors" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-zinc-900 leading-none">
              {value}
              <span className="text-xs font-bold text-zinc-400 ml-1 uppercase">{unit}</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">{title}</h3>
          {description && <p className="text-[10px] font-bold text-zinc-500 uppercase">{description}</p>}
        </div>

        <div className="relative h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
          <div
            className={cn('absolute h-full transition-all duration-1000 ease-out', getProgressColor())}
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
