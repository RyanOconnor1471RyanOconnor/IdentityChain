import { Shield, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Lock className="h-4 w-4" />
            FHE-Encrypted Privacy Protection
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Secure KYC for the
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent"> Blockchain Era</span>
          </h1>
          
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            PayrollChain uses Fully Homomorphic Encryption (FHE) to keep your personal data private while enabling compliant on-chain verification. Your identity, your control.
          </p>
          
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <ConnectButton />
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Learn More
            </Button>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-card p-6 shadow-md transition-shadow hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">Privacy First</h3>
              <p className="text-sm text-muted-foreground">
                Your data is encrypted with FHE technology before going on-chain, ensuring complete privacy.
              </p>
            </div>
            
            <div className="rounded-xl bg-card p-6 shadow-md transition-shadow hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Lock className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">Fully Encrypted</h3>
              <p className="text-sm text-muted-foreground">
                Process verification without ever exposing your sensitive personal information.
              </p>
            </div>
            
            <div className="rounded-xl bg-card p-6 shadow-md transition-shadow hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">Instant Verification</h3>
              <p className="text-sm text-muted-foreground">
                Get verified quickly with our streamlined blockchain-based KYC process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
