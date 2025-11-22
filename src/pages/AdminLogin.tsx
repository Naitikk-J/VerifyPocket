import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, UserCog } from 'lucide-react';
import { ConnectWalletButton } from '@/components/web3/ConnectWalletButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAccount, useSignMessage } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { ADMIN_WALLET_ADDRESS } from '@/config/admin';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { isConnected, address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Validate wallet address locally
      if (!address) {
        setError('Please connect your wallet first.');
        setIsLoading(false);
        return;
      }

      if (address.toLowerCase() !== ADMIN_WALLET_ADDRESS.toLowerCase()) {
        setError('This wallet is not authorized for admin access.');
        setIsLoading(false);
        return;
      }

      // Sign the message for verification
      const domain = window.location.host;
      const origin = window.location.origin;
      const statement = 'Sign in to CredentialPass as an administrator.';
      const nonce = `n_${Math.random().toString(36).substring(2)}`;

      const message = `${domain} wants you to sign in with your Ethereum account:
${address}

${statement}

URI: ${origin}/admin/login
Version: 1
Chain ID: ${chainId}
Nonce: ${nonce}
Issued At: ${new Date().toISOString()}`;

      const signature = await signMessageAsync({ message });

      // Local validation passed, wallet is authorized
      console.log("Admin sign-in successful:", { address, signature });
      sessionStorage.setItem('isAdminLoggedIn', 'true');
      sessionStorage.setItem('adminAddress', address);
      sessionStorage.setItem('adminSignature', signature);

      navigate('/admin/dashboard');

    } catch (err) {
      console.error("Admin sign-in error:", err);
      setError('Sign-in request was rejected or failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
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

      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="glass-card border-primary/20">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="mb-4 p-4 rounded-full bg-primary/10">
                    <UserCog className="h-12 w-12 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
                  <p className="text-muted-foreground">Secure sign-in for administrators.</p>
                </div>

                {!isConnected ? (
                  <div className="text-center">
                     <ConnectWalletButton />
                     <p className="text-sm text-muted-foreground mt-4">Connect the admin wallet to continue.</p>
                  </div>
                ) : (
                  <div className="space-y-6 text-center">
                     <div>
                        <p className='text-sm text-muted-foreground'>Connected as:</p>
                        <p className='font-mono text-sm truncate'>{address}</p>
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button 
                      size="lg"
                      className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg glow-border"
                      onClick={handleLogin}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Verifying...' : 'Sign In as Admin'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
