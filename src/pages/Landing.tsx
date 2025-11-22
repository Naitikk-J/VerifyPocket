import { motion } from 'framer-motion';
import { Shield, Award, Lock, Zap } from 'lucide-react';
import { ConnectWalletButton } from '@/components/web3/ConnectWalletButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

export default function Landing() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Decentralized Identity",
      description: "Your credentials are stored on the blockchain, giving you true ownership and control."
    },
    {
      icon: <Award className="h-8 w-8 text-success" />,
      title: "Verifiable Credentials",
      description: "Employers and institutions can instantly verify your achievements without intermediaries."
    },
    {
      icon: <Lock className="h-8 w-8 text-accent" />,
      title: "Privacy First",
      description: "Share only what you want, when you want. Your data stays secure with cryptographic proofs."
    },
    {
      icon: <Zap className="h-8 w-8 text-xp" />,
      title: "Gamified Experience",
      description: "Earn XP, level up, and showcase your achievements in an engaging, interactive dashboard."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 glass-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Shield className="h-8 w-8 text-primary animate-pulse-glow" />
            <span className="text-xl font-bold glow-text">CredentialPass</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ConnectWalletButton />
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 glow-text">
              Your Digital
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Credential Passport</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Securely store, manage, and share your academic and professional achievements on the blockchain.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isConnected ? (
                <Button 
                  size="lg" 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 glow-border"
                >
                  Enter Dashboard
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  disabled
                  className="bg-gradient-to-r from-primary to-accent opacity-50 text-lg px-8"
                >
                  Connect Wallet to Continue
                </Button>
              )}
            </div>
          </motion.div>

          {/* Floating Animation Element */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 relative h-64"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-pulse-glow" />
            </div>
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="relative z-10 flex items-center justify-center"
            >
              <Shield className="h-32 w-32 text-primary drop-shadow-[0_0_30px_rgba(0,243,255,0.5)]" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose <span className="text-primary">CredentialPass</span>?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="glass-card border-primary/20 hover:border-primary/50 transition-all h-full">
                  <CardContent className="p-6">
                    <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card glow-border p-12 rounded-2xl text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to take control of your credentials?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Connect your MetaMask wallet and start building your digital identity today.
          </p>
          <ConnectWalletButton />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2025 CredentialPass. Powered by Ethereum & Web3.</p>
        </div>
      </footer>
    </div>
  );
}
