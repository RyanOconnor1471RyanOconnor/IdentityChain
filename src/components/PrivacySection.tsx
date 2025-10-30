import { Shield, Lock, Eye, Database } from "lucide-react";

const PrivacySection = () => {
  return (
    <section className="bg-card py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-card-foreground md:text-4xl">
            Your Privacy is Our Priority
          </h2>
          <p className="mb-12 text-lg text-muted-foreground">
            PayrollChain leverages cutting-edge Fully Homomorphic Encryption (FHE) to ensure your sensitive data remains private while enabling verification.
          </p>
        </div>
        
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-8 transition-shadow hover:shadow-md">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-foreground">End-to-End Encryption</h3>
            <p className="text-muted-foreground">
              Your personal information is encrypted on your device before transmission. Only encrypted data ever touches the blockchain.
            </p>
          </div>
          
          <div className="rounded-xl border border-border bg-background p-8 transition-shadow hover:shadow-md">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-foreground">FHE Technology</h3>
            <p className="text-muted-foreground">
              Fully Homomorphic Encryption allows verification computations on encrypted data without ever decrypting it.
            </p>
          </div>
          
          <div className="rounded-xl border border-border bg-background p-8 transition-shadow hover:shadow-md">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Eye className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-foreground">Zero-Knowledge Proofs</h3>
            <p className="text-muted-foreground">
              Verification happens without revealing your actual data. Validators can confirm your identity without seeing your information.
            </p>
          </div>
          
          <div className="rounded-xl border border-border bg-background p-8 transition-shadow hover:shadow-md">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <Database className="h-6 w-6 text-accent" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-foreground">Decentralized Storage</h3>
            <p className="text-muted-foreground">
              Your encrypted data is stored across a decentralized network, eliminating single points of failure or data breaches.
            </p>
          </div>
        </div>
        
        <div className="mt-12 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-8 text-center">
          <p className="text-lg font-medium text-foreground">
            "With PayrollChain, you maintain complete control over your personal information while meeting compliance requirements."
          </p>
        </div>
      </div>
    </section>
  );
};

export default PrivacySection;
