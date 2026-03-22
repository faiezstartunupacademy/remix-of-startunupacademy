import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users, Key, Rocket, BookOpen, MessageSquare, FlaskConical,
  TrendingUp, Activity, Globe, Award, BarChart3, ArrowUpRight,
  ArrowDownRight, Calendar, Clock, Target, Layers, Vote,
  FileText, GraduationCap, Building2, Briefcase
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

interface PlatformStats {
  users: { total: number; admins: number; recent7d: number };
  licenses: { total: number; active: number; expired: number; totalUses: number };
  formations: { total: number; active: number; participants: number; completions: number; quizzes: number; evaluations: number; trainers: number };
  incubation: { projects: number; activeProjects: number; steps: number; completedSteps: number; reports: number; milestones: number; completedMilestones: number; activities: number };
  marketplace: { startups: number; approved: number; pending: number; votes: number; comments: number; ecosystems: number; founders: number; fundingRounds: number; pitchDecks: number; bookmarks: number; programs: number };
  forum: { threads: number; posts: number; chatMessages: number; pinnedThreads: number };
  mvpValidator: { projects: number; hypotheses: number; features: number; tests: number; personas: number; teamMembers: number; metrics: number };
  knowledgeBase: { tests: number };
  dataroom: { deliverables: number; completed: number };
  strategic: { projects: number; accessApproved: number; accessPending: number };
}

type Props = {
  onNavigateTab?: (tab: string) => void;
};

const AdminOverviewDashboard = ({ onNavigateTab }: Props) => {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<{type: string; label: string; time: string}[]>([]);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      const [
        profilesRes, rolesRes, licensesRes,
        formationsRes, formParticipantsRes, formCompletionsRes, formQuizzesRes, formEvalsRes, formTrainersRes,
        incProjectsRes, incStepsRes, incReportsRes, incMilestonesRes, incActivitiesRes,
        mkStartupsRes, mkVotesRes, mkCommentsRes, mkEcosRes, mkFoundersRes, mkFundingRes, mkPitchRes, mkBookmarksRes, mkProgramsRes,
        forumThreadsRes, forumPostsRes, forumChatRes,
        mvpProjectsRes, mvpHypRes, mvpFeatRes, mvpTestsRes, mvpPersonasRes, mvpTeamRes, mvpMetricsRes,
        kbTestsRes,
        dataroomRes,
      ] = await Promise.all([
        supabase.from("profiles").select("created_at", { count: "exact", head: false }),
        supabase.from("user_roles").select("role", { count: "exact", head: false }),
        supabase.from("license_keys").select("is_active, current_uses, expires_at", { count: "exact", head: false }),
        supabase.from("formations").select("is_active", { count: "exact", head: false }),
        supabase.from("formation_participants").select("id", { count: "exact", head: true }),
        supabase.from("formation_completions").select("id", { count: "exact", head: true }),
        supabase.from("formation_quizzes").select("id", { count: "exact", head: true }),
        supabase.from("formation_evaluations").select("id", { count: "exact", head: true }),
        supabase.from("formation_trainers").select("id", { count: "exact", head: true }),
        supabase.from("incubation_projects").select("status", { count: "exact", head: false }),
        supabase.from("incubation_steps").select("status", { count: "exact", head: false }),
        supabase.from("incubation_reports").select("id", { count: "exact", head: true }),
        supabase.from("incubation_milestones").select("status", { count: "exact", head: false }),
        supabase.from("incubation_activities").select("id", { count: "exact", head: true }),
        supabase.from("marketplace_startups").select("is_approved", { count: "exact", head: false }),
        supabase.from("marketplace_votes").select("id", { count: "exact", head: true }),
        supabase.from("marketplace_comments").select("id", { count: "exact", head: true }),
        supabase.from("marketplace_ecosystems").select("id", { count: "exact", head: true }),
        supabase.from("marketplace_founders").select("id", { count: "exact", head: true }),
        supabase.from("marketplace_funding_rounds").select("id", { count: "exact", head: true }),
        supabase.from("marketplace_pitch_decks").select("id", { count: "exact", head: true }),
        supabase.from("marketplace_bookmarks").select("id", { count: "exact", head: true }),
        supabase.from("marketplace_programs" as any).select("id", { count: "exact", head: true }),
        supabase.from("forum_threads").select("is_pinned", { count: "exact", head: false }),
        supabase.from("forum_posts").select("id", { count: "exact", head: true }),
        supabase.from("forum_chat_messages").select("id", { count: "exact", head: true }),
        supabase.from("mvp_validator_projects").select("id", { count: "exact", head: true }),
        supabase.from("mvp_hypotheses").select("id", { count: "exact", head: true }),
        supabase.from("mvp_features").select("id", { count: "exact", head: true }),
        supabase.from("mvp_test_results").select("id", { count: "exact", head: true }),
        supabase.from("mvp_personas").select("id", { count: "exact", head: true }),
        supabase.from("mvp_team_members").select("id", { count: "exact", head: true }),
        supabase.from("mvp_metrics").select("id", { count: "exact", head: true }),
        supabase.from("knowledge_base_tests").select("id", { count: "exact", head: true }),
        supabase.from("dataroom_deliverables").select("completed", { count: "exact", head: false }),
      ]);

      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const recentUsers = profilesRes.data?.filter(p => p.created_at > sevenDaysAgo).length || 0;

      const totalLicenseUses = licensesRes.data?.reduce((sum, l) => sum + (l.current_uses || 0), 0) || 0;
      const activeLicenses = licensesRes.data?.filter(l => l.is_active).length || 0;
      const expiredLicenses = licensesRes.data?.filter(l => l.expires_at && new Date(l.expires_at) < now).length || 0;

      const activeFormations = formationsRes.data?.filter(f => f.is_active).length || 0;

      const activeIncProjects = incProjectsRes.data?.filter(p => p.status === 'active').length || 0;
      const completedSteps = incStepsRes.data?.filter(s => s.status === 'completed').length || 0;
      const completedMilestones = incMilestonesRes.data?.filter(m => m.status === 'completed').length || 0;

      const approvedStartups = mkStartupsRes.data?.filter(s => s.is_approved).length || 0;
      const pendingStartups = mkStartupsRes.data?.filter(s => !s.is_approved).length || 0;

      const pinnedThreads = forumThreadsRes.data?.filter(t => t.is_pinned).length || 0;

      const completedDeliverables = dataroomRes.data?.filter(d => d.completed).length || 0;

      setStats({
        users: {
          total: profilesRes.count || profilesRes.data?.length || 0,
          admins: rolesRes.data?.filter(r => r.role === 'admin').length || 0,
          recent7d: recentUsers,
        },
        licenses: {
          total: licensesRes.count || licensesRes.data?.length || 0,
          active: activeLicenses,
          expired: expiredLicenses,
          totalUses: totalLicenseUses,
        },
        formations: {
          total: formationsRes.count || formationsRes.data?.length || 0,
          active: activeFormations,
          participants: formParticipantsRes.count || 0,
          completions: formCompletionsRes.count || 0,
          quizzes: formQuizzesRes.count || 0,
          evaluations: formEvalsRes.count || 0,
          trainers: formTrainersRes.count || 0,
        },
        incubation: {
          projects: incProjectsRes.count || incProjectsRes.data?.length || 0,
          activeProjects: activeIncProjects,
          steps: incStepsRes.count || incStepsRes.data?.length || 0,
          completedSteps,
          reports: incReportsRes.count || 0,
          milestones: incMilestonesRes.count || incMilestonesRes.data?.length || 0,
          completedMilestones,
          activities: incActivitiesRes.count || 0,
        },
        marketplace: {
          startups: mkStartupsRes.count || mkStartupsRes.data?.length || 0,
          approved: approvedStartups,
          pending: pendingStartups,
          votes: mkVotesRes.count || 0,
          comments: mkCommentsRes.count || 0,
          ecosystems: mkEcosRes.count || 0,
          founders: mkFoundersRes.count || 0,
          fundingRounds: mkFundingRes.count || 0,
          pitchDecks: mkPitchRes.count || 0,
          bookmarks: mkBookmarksRes.count || 0,
          programs: mkProgramsRes.count || 0,
        },
        forum: {
          threads: forumThreadsRes.count || forumThreadsRes.data?.length || 0,
          posts: forumPostsRes.count || 0,
          chatMessages: forumChatRes.count || 0,
          pinnedThreads,
        },
        mvpValidator: {
          projects: mvpProjectsRes.count || 0,
          hypotheses: mvpHypRes.count || 0,
          features: mvpFeatRes.count || 0,
          tests: mvpTestsRes.count || 0,
          personas: mvpPersonasRes.count || 0,
          teamMembers: mvpTeamRes.count || 0,
          metrics: mvpMetricsRes.count || 0,
        },
        knowledgeBase: { tests: kbTestsRes.count || 0 },
        dataroom: {
          deliverables: dataroomRes.count || dataroomRes.data?.length || 0,
          completed: completedDeliverables,
        },
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6 h-28" />
          </Card>
        ))}
      </div>
    );
  }

  const kpiCards = [
    { label: "Utilisateurs", value: stats.users.total, icon: Users, color: "text-blue-600", bg: "from-blue-500/10 to-blue-600/5", sub: `${stats.users.recent7d} nouveaux (7j)` },
    { label: "Administrateurs", value: stats.users.admins, icon: Award, color: "text-amber-600", bg: "from-amber-500/10 to-amber-600/5" },
    { label: "Clés de Licence", value: stats.licenses.total, icon: Key, color: "text-emerald-600", bg: "from-emerald-500/10 to-emerald-600/5", sub: `${stats.licenses.active} actives · ${stats.licenses.totalUses} utilisations` },
    { label: "Formations", value: stats.formations.total, icon: BookOpen, color: "text-purple-600", bg: "from-purple-500/10 to-purple-600/5", sub: `${stats.formations.active} actives` },
    { label: "Participants", value: stats.formations.participants, icon: GraduationCap, color: "text-indigo-600", bg: "from-indigo-500/10 to-indigo-600/5", sub: `${stats.formations.completions} certifications` },
    { label: "Formateurs", value: stats.formations.trainers, icon: Briefcase, color: "text-teal-600", bg: "from-teal-500/10 to-teal-600/5", sub: `${stats.formations.evaluations} évaluations` },
    { label: "Projets Incubation", value: stats.incubation.projects, icon: Rocket, color: "text-orange-600", bg: "from-orange-500/10 to-orange-600/5", sub: `${stats.incubation.activeProjects} actifs` },
    { label: "Étapes Incubation", value: stats.incubation.steps, icon: Target, color: "text-cyan-600", bg: "from-cyan-500/10 to-cyan-600/5", sub: `${stats.incubation.completedSteps} complétées` },
    { label: "Rapports IA", value: stats.incubation.reports, icon: FileText, color: "text-violet-600", bg: "from-violet-500/10 to-violet-600/5", sub: `${stats.incubation.activities} activités` },
    { label: "Jalons", value: stats.incubation.milestones, icon: Layers, color: "text-rose-600", bg: "from-rose-500/10 to-rose-600/5", sub: `${stats.incubation.completedMilestones} atteints` },
    { label: "Startups Marketplace", value: stats.marketplace.startups, icon: Building2, color: "text-sky-600", bg: "from-sky-500/10 to-sky-600/5", sub: `${stats.marketplace.approved} approuvées · ${stats.marketplace.pending} en attente` },
    { label: "Votes", value: stats.marketplace.votes, icon: Vote, color: "text-pink-600", bg: "from-pink-500/10 to-pink-600/5", sub: `${stats.marketplace.comments} commentaires` },
    { label: "Écosystèmes", value: stats.marketplace.ecosystems, icon: Globe, color: "text-lime-600", bg: "from-lime-500/10 to-lime-600/5", sub: `${stats.marketplace.programs} programmes` },
    { label: "Fondateurs", value: stats.marketplace.founders, icon: Users, color: "text-fuchsia-600", bg: "from-fuchsia-500/10 to-fuchsia-600/5", sub: `${stats.marketplace.fundingRounds} tours de table` },
    { label: "Forum Discussions", value: stats.forum.threads, icon: MessageSquare, color: "text-yellow-600", bg: "from-yellow-500/10 to-yellow-600/5", sub: `${stats.forum.posts} réponses · ${stats.forum.pinnedThreads} épinglées` },
    { label: "Chat Messages", value: stats.forum.chatMessages, icon: Activity, color: "text-red-600", bg: "from-red-500/10 to-red-600/5" },
    { label: "Projets MVP", value: stats.mvpValidator.projects, icon: FlaskConical, color: "text-emerald-600", bg: "from-emerald-500/10 to-emerald-600/5", sub: `${stats.mvpValidator.hypotheses} hypothèses` },
    { label: "Features MVP", value: stats.mvpValidator.features, icon: Layers, color: "text-blue-600", bg: "from-blue-500/10 to-blue-600/5", sub: `${stats.mvpValidator.tests} tests exécutés` },
    { label: "Personas", value: stats.mvpValidator.personas, icon: Users, color: "text-orange-600", bg: "from-orange-500/10 to-orange-600/5", sub: `${stats.mvpValidator.teamMembers} membres d'équipe` },
    { label: "Base de Connaissances", value: stats.knowledgeBase.tests, icon: BookOpen, color: "text-purple-600", bg: "from-purple-500/10 to-purple-600/5" },
    { label: "Pitch Decks", value: stats.marketplace.pitchDecks, icon: FileText, color: "text-indigo-600", bg: "from-indigo-500/10 to-indigo-600/5", sub: `${stats.marketplace.bookmarks} favoris` },
    { label: "Data Room", value: stats.dataroom.deliverables, icon: Briefcase, color: "text-teal-600", bg: "from-teal-500/10 to-teal-600/5", sub: `${stats.dataroom.completed} complétés` },
  ];

  const incubationProgress = stats.incubation.steps > 0
    ? Math.round((stats.incubation.completedSteps / stats.incubation.steps) * 100)
    : 0;
  const milestoneProgress = stats.incubation.milestones > 0
    ? Math.round((stats.incubation.completedMilestones / stats.incubation.milestones) * 100)
    : 0;
  const dataroomProgress = stats.dataroom.deliverables > 0
    ? Math.round((stats.dataroom.completed / stats.dataroom.deliverables) * 100)
    : 0;
  const approvalRate = stats.marketplace.startups > 0
    ? Math.round((stats.marketplace.approved / stats.marketplace.startups) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Card className={`bg-gradient-to-br ${kpi.bg} hover:shadow-md transition-shadow`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{kpi.label}</p>
                    <p className="text-2xl font-bold mt-1">{kpi.value.toLocaleString()}</p>
                    {kpi.sub && <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>}
                  </div>
                  <div className={`p-2 rounded-lg bg-background/60 ${kpi.color}`}>
                    <kpi.icon className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Progress Bars Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progression Incubation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Étapes complétées</span>
                <span className="font-bold">{incubationProgress}%</span>
              </div>
              <Progress value={incubationProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">{stats.incubation.completedSteps}/{stats.incubation.steps} étapes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Jalons Atteints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Jalons complétés</span>
                <span className="font-bold">{milestoneProgress}%</span>
              </div>
              <Progress value={milestoneProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">{stats.incubation.completedMilestones}/{stats.incubation.milestones} jalons</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Approbation Marketplace</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Startups approuvées</span>
                <span className="font-bold">{approvalRate}%</span>
              </div>
              <Progress value={approvalRate} className="h-2" />
              <p className="text-xs text-muted-foreground">{stats.marketplace.approved}/{stats.marketplace.startups} startups</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Data Room</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Livrables complétés</span>
                <span className="font-bold">{dataroomProgress}%</span>
              </div>
              <Progress value={dataroomProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">{stats.dataroom.completed}/{stats.dataroom.deliverables} livrables</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Formations Detail */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-purple-600" />
              Formations - Détails
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <DetailRow label="Formations actives" value={stats.formations.active} total={stats.formations.total} />
              <DetailRow label="Participants inscrits" value={stats.formations.participants} />
              <DetailRow label="Certifications délivrées" value={stats.formations.completions} />
              <DetailRow label="Quizzes générés" value={stats.formations.quizzes} />
              <DetailRow label="Évaluations soumises" value={stats.formations.evaluations} />
              <DetailRow label="Formateurs enregistrés" value={stats.formations.trainers} />
            </div>
          </CardContent>
        </Card>

        {/* Marketplace Detail */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5 text-sky-600" />
              Marketplace - Détails
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <DetailRow label="Startups approuvées" value={stats.marketplace.approved} total={stats.marketplace.startups} />
              <DetailRow label="En attente de validation" value={stats.marketplace.pending} />
              <DetailRow label="Votes reçus" value={stats.marketplace.votes} />
              <DetailRow label="Commentaires" value={stats.marketplace.comments} />
              <DetailRow label="Fondateurs enregistrés" value={stats.marketplace.founders} />
              <DetailRow label="Tours de financement" value={stats.marketplace.fundingRounds} />
              <DetailRow label="Pitch decks" value={stats.marketplace.pitchDecks} />
              <DetailRow label="Favoris utilisateurs" value={stats.marketplace.bookmarks} />
              <DetailRow label="Écosystèmes" value={stats.marketplace.ecosystems} />
              <DetailRow label="Programmes" value={stats.marketplace.programs} />
            </div>
          </CardContent>
        </Card>

        {/* MVP Validator Detail */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FlaskConical className="h-5 w-5 text-emerald-600" />
              MVP Validator - Détails
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <DetailRow label="Projets créés" value={stats.mvpValidator.projects} />
              <DetailRow label="Hypothèses formulées" value={stats.mvpValidator.hypotheses} />
              <DetailRow label="Features définies" value={stats.mvpValidator.features} />
              <DetailRow label="Tests exécutés" value={stats.mvpValidator.tests} />
              <DetailRow label="Personas créés" value={stats.mvpValidator.personas} />
              <DetailRow label="Membres d'équipe" value={stats.mvpValidator.teamMembers} />
              <DetailRow label="Points de métriques" value={stats.mvpValidator.metrics} />
            </div>
          </CardContent>
        </Card>

        {/* Forum & Community */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5 text-yellow-600" />
              Communauté - Détails
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <DetailRow label="Discussions créées" value={stats.forum.threads} />
              <DetailRow label="Discussions épinglées" value={stats.forum.pinnedThreads} />
              <DetailRow label="Réponses publiées" value={stats.forum.posts} />
              <DetailRow label="Messages chat" value={stats.forum.chatMessages} />
              <DetailRow label="Base de connaissances" value={stats.knowledgeBase.tests} suffix="tests" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, total, suffix }: { label: string; value: number; total?: number; suffix?: string }) => (
  <div className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
    <span className="text-sm text-muted-foreground">{label}</span>
    <div className="flex items-center gap-2">
      <span className="font-semibold text-sm">{value.toLocaleString()}</span>
      {total !== undefined && (
        <span className="text-xs text-muted-foreground">/ {total}</span>
      )}
      {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
    </div>
  </div>
);

export default AdminOverviewDashboard;
