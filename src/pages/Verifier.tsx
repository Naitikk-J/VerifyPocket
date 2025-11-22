import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Search, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

export default function Verifier() {
  const navigate = useNavigate();
  const [credentialId, setCredentialId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!credentialId) return;
    setIsLoading(true);
    setVerificationResult(null);

    // Simulate API call to verify credential
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock result - in a real app, this would be a real verification
    if (credentialId.startsWith('0x123')) {
      setVerificationResult({
        isValid: true,
        issuer: 'Metacrafters University',
        student: '0xABC...DEF',
        course: 'Advanced Web3 Security',
        grade: 'A+',
      });
    } else {
      setVerificationResult({ isValid: false });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 glass-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <Shield className="h-8 w-8 text-primary animate-pulse-glow" />
            <span className="text-xl font-bold glow-text">CredentialPass</span>
          </motion.div>
        </div>
      </header>

      {/* Verifier Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="glass-card border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Search className="text-primary"/>
                            Credential Verifier
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <div className="space-y-2">
                          <p className='text-muted-foreground'>Enter a Credential ID or Transaction Hash to verify its authenticity.</p>
                           <Input 
                                placeholder="0x... or credential ID"
                                value={credentialId}
                                onChange={(e) => setCredentialId(e.target.value)}
                           />
                       </div>
                       <Button 
                         size="lg"
                         className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg glow-border"
                         onClick={handleVerify}
                         disabled={isLoading || !credentialId}
                        >
                         {isLoading ? 'Verifying...' : 'Verify Credential'}
                       </Button>
                    </CardContent>
                </Card>
            </motion.div>

            {verificationResult && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5}} className="mt-8">
                    <Card className={`glass-card ${verificationResult.isValid ? 'border-success' : 'border-red-500'}`}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {verificationResult.isValid ? <CheckCircle className="text-success"/> : <XCircle className="text-red-500"/>}
                                Verification Result
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {verificationResult.isValid ? (
                                <div className="space-y-3">
                                    <p className="font-semibold text-lg text-success">Credential is Valid</p>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Issued by:</p>
                                        <p>{verificationResult.issuer}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Issued to:</p>
                                        <p className='font-mono'>{verificationResult.student}</p>
                                    </div>
                                     <div>
                                        <p className="text-sm text-muted-foreground">Course:</p>
                                        <p>{verificationResult.course}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Grade:</p>
                                        <p>{verificationResult.grade}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="font-semibold text-lg text-red-500">Credential is Invalid or Not Found.</p>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
      </section>
    </div>
  );
}
