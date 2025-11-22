import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'success' | 'xp' | 'accent';
}

export function ProgressBar({ 
  value, 
  max = 100, 
  label, 
  className,
  showPercentage = true,
  color = 'primary'
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    primary: 'bg-primary',
    success: 'bg-success',
    xp: 'bg-xp',
    accent: 'bg-accent',
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">{label}</span>
          {showPercentage && (
            <span className="text-sm text-muted-foreground">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className="h-3 bg-secondary rounded-full overflow-hidden border border-border/50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full relative overflow-hidden",
            colorClasses[color]
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
}
