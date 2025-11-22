import { motion } from 'framer-motion';
import { Award, Calendar, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CredentialCardProps {
  title: string;
  issuer: string;
  issueDate: string;
  verified: boolean;
  credentialType: string;
  index: number;
}

export function CredentialCard({ 
  title, 
  issuer, 
  issueDate, 
  verified, 
  credentialType,
  index 
}: CredentialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card className="glass-card border-primary/20 hover:border-primary/50 transition-all group cursor-pointer h-full">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Award className="h-6 w-6 text-primary" />
            </div>
            {verified && (
              <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          
          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4">
            Issued by <span className="text-foreground font-medium">{issuer}</span>
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {issueDate}
            </div>
            <Badge variant="secondary" className="text-xs">
              {credentialType}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
