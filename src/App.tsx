import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAuthPage from "./pages/AdminAuthPage";
import DesignThinkingPage from "./pages/DesignThinkingPage";
import LeanCanvasPage from "./pages/LeanCanvasPage";
import GrowthHackingPage from "./pages/GrowthHackingPage";
import BusinessModelPage from "./pages/BusinessModelPage";
import StartupMarketingPage from "./pages/StartupMarketingPage";
import EcosystemPage from "./pages/EcosystemPage";
import StartupsPage from "./pages/StartupsPage";
import OperatingModelPage from "./pages/OperatingModelPage";
import CChiefPage from "./pages/CChiefPage";
import FormationsPage from "./pages/FormationsPage";
import BMComparisonPage from "./pages/BMComparisonPage";
import CroissancePage from "./pages/CroissancePage";
import MentalModelsPage from "./pages/MentalModelsPage";
import EffectuationPage from "./pages/EffectuationPage";
import PlatformStrategyPage from "./pages/PlatformStrategyPage";
import StartupMontagePage from "./pages/StartupMontagePage";
import SearchPage from "./pages/SearchPage";
// StrategicPolePage replaced by IncubationDashboard
import CommunityPage from "./pages/CommunityPage";
import ForumPage from "./pages/ForumPage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import WelcomeVideoModal from "./components/WelcomeVideoModal";
import ProtectedFormation from "./components/ProtectedFormation";
import IncubationDashboard from "./pages/IncubationDashboard";
import NewIncubationProject from "./pages/NewIncubationProject";
import IncubationProject from "./pages/IncubationProject";
import TestDetail from "./pages/TestDetail";
import KnowledgeBase from "./pages/KnowledgeBase";
import StrategicAccessGate from "./components/strategic/StrategicAccessGate";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import DisciplinedEntrepreneurshipPage from "./pages/DisciplinedEntrepreneurshipPage";
import LeanCanvasLabPage from "./pages/LeanCanvasLabPage";
import MarketIntelligencePage from "./pages/MarketIntelligencePage";
import StrategicConsolePage from "./pages/StrategicConsolePage";
import InvestPage from "./pages/InvestPage";
import AIBusinessPage from "./pages/AIBusinessPage";
import MarketplacePage from "./pages/MarketplacePage";
import StartupDetailPage from "./pages/StartupDetailPage";
import StartupPrivateSpace from "./pages/StartupPrivateSpace";
import LegalPage from "./pages/LegalPage";
import MyConsentPage from "./pages/MyConsentPage";
import CookieConsentBanner from "./components/legal/CookieConsentBanner";
import DataRightsCenter from "./pages/DataRightsCenter";
import OnboardingPage from "./pages/OnboardingPage";
import MissionControl from "./pages/MissionControl";
import UserRolesPage from "./pages/UserRolesPage";
import RoadmapPage from "./pages/RoadmapPage";
import DealRoomPage from "./pages/DealRoomPage";
import MentorsPage from "./pages/MentorsPage";
import MentorProfilePage from "./pages/MentorProfilePage";
import MentorDashboard from "./pages/MentorDashboard";
import CoachDashboard from "./pages/CoachDashboard";
import NotificationsPage from "./pages/NotificationsPage";
import FundingPage from "./pages/FundingPage";
import FundingApplicationsPage from "./pages/FundingApplicationsPage";
import CommunityFeedPage from "./pages/CommunityFeedPage";
import EventsPage from "./pages/EventsPage";
import CofounderMatchingPage from "./pages/CofounderMatchingPage";
import LegalCompliancePage from "./pages/LegalCompliancePage";
import BottomNav from "./components/BottomNav";
import LanguageSync from "./components/LanguageSync";
import InstallPwaPrompt from "./components/InstallPwaPrompt";
import PartnersDirectoryPage from "./pages/PartnersDirectoryPage";
import DevenirFormateurPage from "./pages/DevenirFormateurPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageSync />
        <WelcomeVideoModal />
        <CookieConsentBanner />
        <Routes>

          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/auth" element={<AdminAuthPage />} />
          <Route path="/formations" element={<FormationsPage />} />
          <Route path="/formation/design-thinking" element={<ProtectedFormation contentSlug="design-thinking" contentName="Design Thinking"><DesignThinkingPage /></ProtectedFormation>} />
          <Route path="/formation/lean-canvas" element={<ProtectedFormation contentSlug="lean-canvas" contentName="Lean Canvas"><LeanCanvasPage /></ProtectedFormation>} />
          <Route path="/formation/growth-hacking" element={<ProtectedFormation contentSlug="growth-hacking" contentName="Growth Hacking"><GrowthHackingPage /></ProtectedFormation>} />
          <Route path="/formation/business-model" element={<ProtectedFormation contentSlug="business-model" contentName="Business Model"><BusinessModelPage /></ProtectedFormation>} />
          <Route path="/formation/bm-comparison" element={<ProtectedFormation contentSlug="bm-comparison" contentName="BMC vs Lean Canvas"><BMComparisonPage /></ProtectedFormation>} />
          <Route path="/formation/croissance" element={<ProtectedFormation contentSlug="croissance" contentName="Croissance & Métriques"><CroissancePage /></ProtectedFormation>} />
          <Route path="/formation/startup-marketing" element={<ProtectedFormation contentSlug="startup-marketing" contentName="Marketing Startups"><StartupMarketingPage /></ProtectedFormation>} />
          <Route path="/formation/operating-model" element={<ProtectedFormation contentSlug="operating-model" contentName="Operating Model"><OperatingModelPage /></ProtectedFormation>} />
          <Route path="/formation/mental-models" element={<ProtectedFormation contentSlug="mental-models" contentName="Mental Models"><MentalModelsPage /></ProtectedFormation>} />
          <Route path="/formation/platform-strategy" element={<ProtectedFormation contentSlug="platform-strategy" contentName="Platform Strategy"><PlatformStrategyPage /></ProtectedFormation>} />
          <Route path="/formation/startup-montage" element={<ProtectedFormation contentSlug="startup-montage" contentName="Montage des Startups"><StartupMontagePage /></ProtectedFormation>} />
          <Route path="/formation/disciplined-entrepreneurship" element={<ProtectedFormation contentSlug="disciplined-entrepreneurship" contentName="Disciplined Entrepreneurship"><DisciplinedEntrepreneurshipPage /></ProtectedFormation>} />
          <Route path="/ecosysteme" element={<ProtectedFormation contentSlug="ecosysteme" contentName="Écosystème Startup Tunisien"><EcosystemPage /></ProtectedFormation>} />
          <Route path="/startups" element={<StartupsPage />} />
          <Route path="/fondements/effectuation" element={<ProtectedFormation contentSlug="effectuation" contentName="Effectuation"><EffectuationPage /></ProtectedFormation>} />
          <Route path="/c-chief" element={<ProtectedFormation contentSlug="c-chief" contentName="C-CHIEF Leadership"><CChiefPage /></ProtectedFormation>} />
          <Route path="/formation/ai-business" element={<ProtectedFormation contentSlug="ai-business" contentName="AI Business"><AIBusinessPage /></ProtectedFormation>} />
          <Route path="/recherche" element={<SearchPage />} />
          <Route path="/pole-strategique" element={<StrategicAccessGate><IncubationDashboard /></StrategicAccessGate>} />
          <Route path="/pole-strategique/new" element={<StrategicAccessGate><NewIncubationProject /></StrategicAccessGate>} />
          <Route path="/pole-strategique/:id" element={<StrategicAccessGate><IncubationProject /></StrategicAccessGate>} />
          <Route path="/pole-strategique/:projectId/test/:testId" element={<StrategicAccessGate><TestDetail /></StrategicAccessGate>} />
          <Route path="/strategic-console/:projectId" element={<StrategicAccessGate><StrategicConsolePage /></StrategicAccessGate>} />
          <Route path="/mvp-validator" element={<Navigate to="/pole-strategique" replace />} />
          <Route path="/communaute" element={<CommunityPage />} />
          <Route path="/communaute/invest" element={<InvestPage />} />
          <Route path="/communaute/forum" element={<ForumPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/marketplace/:slug" element={<StartupDetailPage />} />
          <Route path="/startup-space/:id" element={<StartupPrivateSpace />} />
          <Route path="/knowledge" element={<KnowledgeBase />} />
          <Route path="/communaute/lean-canvas-lab" element={<LeanCanvasLabPage />} />
          <Route path="/lean-canvas-lab" element={<Navigate to="/communaute/lean-canvas-lab" replace />} />
          <Route path="/market-intelligence" element={<MarketIntelligencePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/legal/:slug" element={<LegalPage />} />
          <Route path="/profil/consentement" element={<MyConsentPage />} />
          <Route path="/profil/donnees" element={<DataRightsCenter />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/mission-control" element={<MissionControl />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/deal-room" element={<DealRoomPage />} />
          <Route path="/mentors" element={<MentorsPage />} />
          <Route path="/mentors/:id" element={<MentorProfilePage />} />
          <Route path="/mentor-dashboard" element={<MentorDashboard />} />
          <Route path="/coach-dashboard" element={<CoachDashboard />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/financement" element={<FundingPage />} />
          <Route path="/candidatures" element={<FundingApplicationsPage />} />
          <Route path="/feed" element={<CommunityFeedPage />} />
          <Route path="/evenements" element={<EventsPage />} />
          <Route path="/cofounders" element={<CofounderMatchingPage />} />
          <Route path="/profil/conformite" element={<LegalCompliancePage />} />
          <Route path="/profil/roles" element={<UserRolesPage />} />
          <Route path="/annuaire" element={<PartnersDirectoryPage />} />
          <Route path="/partenaires" element={<PartnersDirectoryPage />} />
          <Route path="/communaute/devenir-formateur" element={<DevenirFormateurPage />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
        <BottomNav />
        <InstallPwaPrompt />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

