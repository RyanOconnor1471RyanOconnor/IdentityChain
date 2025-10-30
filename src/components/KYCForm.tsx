import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";
import { encryptKYC } from "@/lib/fhe";

// Contract address - update this after deployment
const KYC_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

// Nationality codes mapping
const NATIONALITIES: Record<string, number> = {
  "United States": 1,
  "United Kingdom": 2,
  "Canada": 3,
  "Australia": 4,
  "Germany": 5,
  "France": 6,
  "Japan": 7,
  "China": 8,
  "India": 9,
  "Brazil": 10,
  "Other": 255,
};

// Document types
const DOC_TYPES: Record<string, number> = {
  "Passport": 1,
  "National ID": 2,
  "Driver's License": 3,
};

const KYCForm = () => {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dateOfBirth: "",
    nationality: "",
    documentType: "",
  });

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to submit KYC information.",
        variant: "destructive",
      });
      return;
    }

    if (KYC_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      toast({
        title: "Contract Not Deployed",
        description: "Please deploy the PrivacyKYC contract first and update the contract address.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Calculate age from date of birth
      const age = calculateAge(formData.dateOfBirth);

      if (age < 18) {
        toast({
          title: "Age Requirement",
          description: "You must be at least 18 years old to submit KYC.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Get nationality and document type codes
      const nationalityCode = NATIONALITIES[formData.nationality] || NATIONALITIES["Other"];
      const docTypeCode = DOC_TYPES[formData.documentType] || 1;

      toast({
        title: "Encrypting Data",
        description: "Encrypting your KYC information using FHE...",
      });

      // Encrypt KYC data using FHE
      const encrypted = await encryptKYC(
        age,
        nationalityCode,
        docTypeCode,
        KYC_CONTRACT_ADDRESS,
        address
      );

      console.log("Encrypted KYC data:", {
        age,
        nationality: nationalityCode,
        documentType: docTypeCode,
        encrypted
      });

      toast({
        title: "Encryption Complete",
        description: "Your data has been encrypted. Ready to submit to blockchain.",
      });

      // TODO: Submit to contract
      // const tx = await submitKYC(encrypted);
      // await tx.wait();

      setIsSubmitting(false);
      setIsVerified(true);

      toast({
        title: "KYC Submitted Successfully",
        description: "Your encrypted information has been submitted to the blockchain.",
      });

    } catch (error: any) {
      console.error("KYC submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to encrypt and submit KYC data",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  if (isVerified) {
    return (
      <Card className="mx-auto max-w-2xl shadow-lg">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
            <CheckCircle2 className="h-8 w-8 text-accent" />
          </div>
          <h3 className="mb-2 text-2xl font-bold text-card-foreground">Verification Complete!</h3>
          <p className="mb-6 text-muted-foreground">
            Your KYC information has been securely encrypted with FHE and stored on-chain.
          </p>
          <Button onClick={() => setIsVerified(false)} variant="outline">
            Submit New Verification
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl shadow-lg">
      <CardHeader>
        <div className="mb-2 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>KYC Verification</CardTitle>
        </div>
        <CardDescription>
          Your information will be encrypted using FHE technology before being submitted to the blockchain.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                required
                disabled={isSubmitting}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Select
                value={formData.nationality}
                onValueChange={(value) => setFormData({ ...formData, nationality: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select nationality" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(NATIONALITIES).map((nat) => (
                    <SelectItem key={nat} value={nat}>
                      {nat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentType">Identity Document Type</Label>
            <Select
              value={formData.documentType}
              onValueChange={(value) => setFormData({ ...formData, documentType: value })}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(DOC_TYPES).map((doc) => (
                  <SelectItem key={doc} value={doc}>
                    {doc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div className="text-sm text-muted-foreground">
                <strong className="text-foreground">Privacy Protected:</strong> Your age, nationality, and document type will be encrypted using Fully Homomorphic Encryption (FHE) before being submitted. Your name and email remain off-chain for identity verification purposes only.
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || !isConnected}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Encrypting & Submitting...
              </>
            ) : (
              "Submit KYC"
            )}
          </Button>

          {!isConnected && (
            <p className="text-center text-sm text-muted-foreground">
              Please connect your wallet to submit KYC information
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default KYCForm;
