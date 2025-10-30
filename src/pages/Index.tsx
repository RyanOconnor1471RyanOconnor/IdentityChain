import Header from "@/components/Header";
import Hero from "@/components/Hero";
import KYCForm from "@/components/KYCForm";
import PrivacySection from "@/components/PrivacySection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <section id="kyc" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <KYCForm />
        </div>
      </section>
      <div id="privacy">
        <PrivacySection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
