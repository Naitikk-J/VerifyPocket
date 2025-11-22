import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAccount } from 'wagmi';

interface Certificate {
    _id: string;
    studentAddress: string;
    course: string;
    grade: string;
    issuedBy: string;
    hash: string;
    issuedAt: string;
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const [credentials, setCredentials] = useState<Certificate[]>([]);

  useEffect(() => {
    if (address) {
      fetchCredentials(address);
    }
  }, [address]);

  const fetchCredentials = async (studentAddress: string) => {
    const response = await axios.get('http://localhost:3001/api/credentials');
    const userCredentials = response.data.filter((cred: Certificate) => cred.studentAddress.toLowerCase() === studentAddress.toLowerCase());
    setCredentials(userCredentials);
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/50 glass-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Shield className="h-8 w-8 text-primary animate-pulse-glow" />
            <span className="text-xl font-bold glow-text">CredentialPass</span>
          </div>
          <h1 className="text-2xl font-bold text-center">Student Wallet</h1>
          {address && <div className='font-mono text-sm'>{`${address.slice(0, 6)}...${address.slice(-4)}`}</div>}
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-3xl font-bold mb-6">Your Credentials</h2>
            {credentials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {credentials.map((cred, index) => (
                    <motion.div key={cred._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.1 }}>
                    <Card className="glass-card h-full flex flex-col">
                        <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary"><Award /> {cred.course}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                        <p className="text-muted-foreground">Issued by: {cred.issuedBy}</p>
                        <p className="text-muted-foreground">Date: {new Date(cred.issuedAt).toLocaleDateString()}</p>
                        <p className="text-muted-foreground">Grade: {cred.grade}</p>
                        </CardContent>
                        <div className="p-6 pt-0">
                            <Button className="w-full" onClick={() => navigate(`/verifier?certId=${cred.hash}`)}><Eye className="mr-2 h-4 w-4"/> View & Verify</Button>
                        </div>
                    </Card>
                    </motion.div>
                ))}
                </div>
            ) : (
                <p>No credentials found for this wallet address.</p>
            )}
        </motion.div>
      </main>
    </div>
  );
}
