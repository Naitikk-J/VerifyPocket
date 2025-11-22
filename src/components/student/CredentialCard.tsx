import { motion } from 'framer-motion';
import { Download, Share2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useState } from 'react';

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  studentPhoto: string;
  certificateThumb: string;
  issuedAt: string;
  txHash: string;
  isVerified: boolean;
}

interface CredentialCardProps {
  certificate: Certificate;
  index: number;
}

export function CredentialCard({ certificate, index }: CredentialCardProps) {
  const [isShareLoading, setIsShareLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleShare = async () => {
    setIsShareLoading(true);
    try {
      const shareUrl = `${window.location.origin}/verifier?certId=${certificate.id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Proof link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    } finally {
      setIsShareLoading(false);
    }
  };

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      const link = document.createElement('a');
      link.href = certificate.certificateThumb;
      link.download = `${certificate.title}-${certificate.issuedAt.slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('PDF download started');
    } catch (error) {
      toast.error('Failed to download PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleViewTx = () => {
    const etherscanUrl = `https://etherscan.io/tx/${certificate.txHash}`;
    window.open(etherscanUrl, '_blank');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateTx = (tx: string) => `${tx.slice(0, 6)}...${tx.slice(-4)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="h-full"
    >
      <Card className="glass-card border-primary/20 hover:border-primary/50 transition-all group h-full flex flex-col overflow-hidden">
        {/* Certificate Image Section */}
        <div className="relative w-full aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
          {certificate.certificateThumb && (
            <motion.img
              src={certificate.certificateThumb}
              alt={certificate.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
          
          {/* Student Avatar - Top Right */}
          {certificate.studentPhoto && (
            <div className="absolute top-3 right-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-14 h-14 rounded-full border-2 border-primary/50 overflow-hidden bg-background"
              >
                <img
                  src={certificate.studentPhoto}
                  alt="Student"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          )}

          {/* Verification Badge - Top Left */}
          {certificate.isVerified && (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-3 left-3"
            >
              <Badge className="bg-success/90 text-success-foreground border-0 shadow-lg animate-pulse-glow flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                On-Chain Verified
              </Badge>
            </motion.div>
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Metadata Section */}
        <div className="flex-1 flex flex-col p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
              {certificate.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              Issued by <span className="text-foreground font-medium">{certificate.issuer}</span>
            </p>
          </div>

          {/* Date Badge */}
          <div className="mb-4 inline-flex">
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/30">
              Issued: {formatDate(certificate.issuedAt)}
            </Badge>
          </div>

          {/* On-Chain Proof Link */}
          {certificate.isVerified && (
            <button
              onClick={handleViewTx}
              className="text-xs text-primary hover:text-accent underline transition-colors mb-6 text-left"
            >
              View Tx: {truncateTx(certificate.txHash)} →
            </button>
          )}

          <div className="flex-1" />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-primary/10">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 glass-card border-primary/30 hover:bg-primary/20"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? 'Downloading...' : 'Download PDF'}
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
              onClick={handleShare}
              disabled={isShareLoading}
            >
              <Share2 className="h-4 w-4 mr-2" />
              {isShareLoading ? 'Copied!' : 'Share Proof'}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
