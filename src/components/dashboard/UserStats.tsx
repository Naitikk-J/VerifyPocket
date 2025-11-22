import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Star, Award, TrendingUp } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  index: number;
}

function StatCard({ icon, label, value, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <Card className="glass-card border-primary/20 hover:glow-border transition-all">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            {icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-primary">{value}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function UserStats() {
  const stats = [
    { icon: <Trophy className="h-5 w-5 text-xp" />, label: "Total XP", value: "2,450", index: 0 },
    { icon: <Star className="h-5 w-5 text-primary" />, label: "Level", value: "12", index: 1 },
    { icon: <Award className="h-5 w-5 text-success" />, label: "Credentials", value: "8", index: 2 },
    { icon: <TrendingUp className="h-5 w-5 text-accent" />, label: "Rank", value: "#247", index: 3 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
