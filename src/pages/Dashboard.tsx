import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Shield, LogOut, Settings, Plus } from 'lucide-react';
import { ConnectWalletButton } from '@/components/web3/ConnectWalletButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { UserStats } from '@/components/dashboard/UserStats';
import { CredentialCard } from '@/components/dashboard/CredentialCard';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isConnected) {
      navigate('/');
    }
  }, [isConnected, navigate]);

  const mockCredentials = [
    {
      title: "Bachelor of Computer Science",
      issuer: "MIT",
      issueDate: "May 2023",
      verified: true,
      credentialType: "Degree"
    },
    {
      title: "Web3 Developer Certification",
      issuer: "Ethereum Foundation",
      issueDate: "Jan 2024",
      verified: true,
      credentialType: "Certificate"
    },
    {
      title: "Smart Contract Auditor",
      issuer: "ConsenSys Academy",
      issueDate: "Mar 2024",
      verified: true,
      credentialType: "Certificate"
    },
    {
      title: "Data Structures & Algorithms",
      issuer: "Stanford Online",
      issueDate: "Aug 2022",
      verified: true,
      credentialType: "Course"
    },
    {
      title: "Blockchain Fundamentals",
      issuer: "Berkeley",
      issueDate: "Dec 2022",
      verified: true,
      credentialType: "Course"
    },
    {
      title: "Full-Stack JavaScript",
      issuer: "freeCodeCamp",
      issueDate: "Jun 2023",
      verified: true,
      credentialType: "Certificate"
    }
  ];

  if (!isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 glass-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <Shield className="h-8 w-8 text-primary animate-pulse-glow" />
              <span className="text-xl font-bold glow-text">CredentialPass</span>
            </motion.div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Settings className="h-5 w-5" />
              </Button>
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* User Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="glass-card glow-border">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-primary/50">
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
                    {address?.slice(2, 4).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold">Student Scholar</h1>
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                      Level 12
                    </span>
                  </div>
                  <p className="text-muted-foreground font-mono mb-4">
                    {address}
                  </p>
                  
                  <div className="space-y-3">
                    <ProgressBar 
                      value={2450} 
                      max={3000} 
                      label="XP Progress" 
                      color="xp"
                    />
                    <ProgressBar 
                      value={75} 
                      max={100} 
                      label="Profile Completion" 
                      color="success"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="mb-8">
          <UserStats />
        </div>

        {/* Credentials Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">My Credentials</CardTitle>
                <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" />
                  Request Credential
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockCredentials.map((credential, index) => (
                  <CredentialCard key={index} {...credential} index={index} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievement Quests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="glass-card border-accent/20">
            <CardHeader>
              <CardTitle className="text-xl">Active Quests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50">
                <div>
                  <p className="font-medium">Complete Your Profile</p>
                  <p className="text-sm text-muted-foreground">Add bio and avatar</p>
                </div>
                <span className="text-xp font-bold">+50 XP</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50">
                <div>
                  <p className="font-medium">Verify Email Address</p>
                  <p className="text-sm text-muted-foreground">Connect your academic email</p>
                </div>
                <span className="text-xp font-bold">+100 XP</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50">
                <div>
                  <p className="font-medium">Connect with Issuer</p>
                  <p className="text-sm text-muted-foreground">Link to your university</p>
                </div>
                <span className="text-xp font-bold">+200 XP</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
