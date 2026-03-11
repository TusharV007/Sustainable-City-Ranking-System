import { Badge } from './ui/badge';

interface ImpactBadgeProps {
  impact: 'Low' | 'Medium' | 'High';
  size?: 'sm' | 'md' | 'lg';
}

export function ImpactBadge({ impact, size = 'md' }: ImpactBadgeProps) {
  const getColor = () => {
    switch (impact) {
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'High':
        return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'md':
        return 'text-sm px-2.5 py-1';
      case 'lg':
        return 'text-base px-3 py-1.5';
    }
  };

  return (
    <Badge className={`${getColor()} ${getSizeClass()} border font-medium`} variant="outline">
      {impact} Impact
    </Badge>
  );
}
