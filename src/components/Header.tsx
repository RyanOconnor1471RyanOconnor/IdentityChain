import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Shield } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">IdentityChain</span>
        </div>
        
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#kyc" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Verify Identity
          </a>
          <a href="#privacy" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Privacy
          </a>
          <a href="#about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            About FHE
          </a>
        </nav>
        
        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;
