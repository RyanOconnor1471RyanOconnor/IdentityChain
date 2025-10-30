import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-card-foreground">IdentityChain</span>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Secure, private KYC verification powered by Fully Homomorphic Encryption. Your identity, your control.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold text-card-foreground">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                  Documentation
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold text-card-foreground">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 IdentityChain. All rights reserved. Built with FHE technology.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
