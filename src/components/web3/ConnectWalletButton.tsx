import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { useMounted } from '@/hooks/useMounted';
import { Wallet, LogOut } from 'lucide-react';

export function ConnectWalletButton() {
  const mounted = useMounted();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // Prevent hydration mismatch - don't render wallet state until mounted
  if (!mounted) {
    return (
      <Button variant="outline" disabled className="glass-card border-primary/30">
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="glass-card px-4 py-2 rounded-lg border border-primary/30">
          <span className="text-primary font-mono text-sm">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => disconnect()}
          className="glass-card border-destructive/50 hover:bg-destructive/20"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => connect({ connector: connectors[0] })}
      className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all glow-border"
    >
      <Wallet className="mr-2 h-4 w-4" />
      Connect MetaMask
    </Button>
  );
}
