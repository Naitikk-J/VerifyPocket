import { motion } from 'framer-motion';
import { Shield, GraduationCap, Briefcase, Search } from 'lucide-react';
import { ConnectWalletButton } from '@/components/web3/ConnectWalletButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  const portals = [
    {
      icon: <GraduationCap className="h-12 w-12 text-primary" />,
      title: "Student Wallet",
      description: "Manage your academic and professional credentials.",
      path: "/dashboard"
    },
    {
      icon: <Briefcase className="h-12 w-12 text-success" />,
      title: "Admin Panel",
      description: "Manage students, issue credentials, and view all records.",
      path: "/admin"
    },
    {
      icon: <Search className="h-12 w-12 text-accent" />,
      title: "Verifier Tool",
      description: "Verify the authenticity of a credential.",
      path: "/verifier"
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
              Welcome to
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> CredentialPass</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              The future of verifiable credentials.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {portals.map((portal, index) => (
              <motion.div
                key={portal.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <Card 
                  className="glass-card border-primary/20 hover:border-primary/50 transition-all h-full cursor-pointer"
                  onClick={() => navigate(portal.path)}
                >
                  <CardContent className="p-8 flex flex-col items-center justify-center">
                    <div className="mb-6 p-4 rounded-full bg-primary/10">
                      {portal.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{portal.title}</h3>
                    <p className="text-muted-foreground text-center">{portal.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

        </div>
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