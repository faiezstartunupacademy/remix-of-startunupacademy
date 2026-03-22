import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FormationsSection from "@/components/FormationsSection";
import EcosystemPreview from "@/components/EcosystemPreview";
import GreenBusinessSection from "@/components/GreenBusinessSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FormationsSection />
        <GreenBusinessSection />
        <EcosystemPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
