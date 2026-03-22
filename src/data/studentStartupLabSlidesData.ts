// Student Startup Lab - Discipline Entrepreneuriale (40 slides)
import { DTSlide } from './designThinkingSlidesData';

import introImg from '@/assets/startup-lab/introduction.jpg';
import ecosystemeImg from '@/assets/startup-lab/ecosysteme.jpg';
import anatomieImg from '@/assets/startup-lab/anatomie.jpg';
import businessModelImg from '@/assets/startup-lab/business-model.jpg';
import executionAgileImg from '@/assets/startup-lab/execution-agile.jpg';
import plateformeTechImg from '@/assets/startup-lab/plateforme-tech.jpg';
import metriquesImg from '@/assets/startup-lab/metriques.jpg';

const MODULE_IMAGES: Record<string, string> = {
  'Introduction': introImg,
  'Écosystème Startup': ecosystemeImg,
  'Anatomie de la Startup': anatomieImg,
  'Business Model': businessModelImg,
  'Exécution Agile': executionAgileImg,
  'Plateforme Tech': plateformeTechImg,
  'Métriques Startup': metriquesImg,
  'Conclusion': anatomieImg,
};

export const studentStartupLabSlidesData: DTSlide[] = [
  // Introduction (1-4)
  { id: 1, module: 'Introduction', title: 'Student Startup Lab', subtitle: 'Discipline Entrepreneuriale', content: ['Animé par Faiez GHORBEL', 'Expert universitaire en entrepreneuriat', 'Co-fondateur Djagora Foundation'], type: 'intro', image: introImg },
  { id: 2, module: 'Introduction', title: 'Le Monde des Startups en Chiffres', subtitle: 'Pensées → Idées → Startups', content: ['6 200 pensées/jour par personne', '5-10% nouvelles → 310-620 pensées originales/jour', '~1-3% orientées business → ~1-5 idées d\'affaires/jour', '137 000 startups créées/jour dans le monde', 'Taux de survie ~10% → ~13 700 survivent à 5 ans/jour'], type: 'content', image: introImg },
  { id: 3, module: 'Introduction', title: 'Faiez GHORBEL', subtitle: 'Expert & Animateur', content: ['Maître Assistant - ISGIS Sfax | Enseignant-chercheur', 'Référant institutionnel PEES | Expert APII', 'Co-fondateur Djagora Foundation', 'Scrum Master Professional (SMPC®) | Gemini Educator'], type: 'content', image: introImg },
  { id: 4, module: 'Introduction', title: 'Outils & Ressources Étudiants', subtitle: 'GitHub Student Benefits & TAAFT', content: ['GitHub Student Developer Pack', 'Majarra, Perks et ressources startups', 'TAAFT - Outils IA pour étudiants', 'Startup Graveyard - Leçons des échecs'], type: 'content', image: introImg },

  // Écosystème & Startup Act (5-8)
  { id: 5, module: 'Écosystème Startup', title: 'Carte d\'Identité Startup Act', subtitle: 'République de l\'Innovation', content: ['Label SA-2026: Startup innovante & scalable', 'Cadre légal: Loi n° 2018-20', 'Soutien: Communauté & Écosystème Smart Capital', 'Ambition internationale & Innovation Hub'], type: 'content', image: ecosystemeImg },
  { id: 6, module: 'Écosystème Startup', title: 'Qatar: Avantages Startup (Fév. 2026)', subtitle: 'Web Summit Announcements', content: ['Fonds de fonds: 3 milliards $ (+ 2 Mds ajoutés)', 'Visa entrepreneur de 10 ans', 'Crédits de calcul haute performance (IA)', 'Augmentation de 8x du soutien QDB', 'QFC: 0$ frais d\'enregistrement (3 premières années)'], type: 'content', image: ecosystemeImg },
  { id: 7, module: 'Écosystème Startup', title: 'Égypte: Charte des Startups (Fév. 2026)', subtitle: 'Incitations & Objectifs', content: ['Impôt simplifié: 0.4% - 1.5% pour revenus < 20M EGP', 'Objectif: 5 milliards $ d\'investissements', 'Soutenir 5 000 startups, créer 500 000 emplois', 'Viser 5 licornes d\'ici 2030', 'Processus de liquidation accéléré (90 jours)'], type: 'content', image: ecosystemeImg },
  { id: 8, module: 'Écosystème Startup', title: 'Innovation Hub & Market Share', subtitle: 'Tunisie vs Égypte', content: ['Comparaison des écosystèmes MENA', 'Opportunités régionales pour les startups', 'Positionnement stratégique Tunisia/Egypt'], type: 'content', image: ecosystemeImg },

  // L'Anatomie de la Startup (9-18)
  { id: 9, module: 'Anatomie de la Startup', title: 'L\'Anatomie Complète d\'une Startup', subtitle: 'Le Corps Humain comme Métaphore', content: ['CERVEAU: Fondateur / Mental Model / Imagination', 'YEUX: Design Thinking', 'CŒUR: Lean Canvas', 'POUMONS: Vision / Why', 'SQUELETTE: Business Model', 'MUSCLES: Growth Hacking', 'SANG: Cash Flow', 'PEAU: Plateforme', 'ADN: Culture & Valeurs'], type: 'content', image: anatomieImg },
  { id: 10, module: 'Anatomie de la Startup', title: 'Vision & Mission', subtitle: 'Simon Sinek - Start With Why', content: ['"Les gens n\'achètent pas ce que vous faites, ils achètent pourquoi vous le faites"', 'Team → Product → Vision & Mission → Culture → Growth', 'Le Why comme fondation de tout'], type: 'content', image: anatomieImg },
  { id: 11, module: 'Anatomie de la Startup', title: 'Le Cerveau: Modèle Mental', subtitle: 'The Imagination Machine (Reeves & Fuller)', content: ['Perception & modèles existants: Observer, détecter les anomalies', 'La surprise & l\'imagination: "Pourquoi pas?", "Et si..?"', 'Création de l\'avenir: Concrétiser, expérimenter', 'Processus continu: Apprendre, Adapter, Réimaginer'], type: 'content', image: anatomieImg },
  { id: 12, module: 'Anatomie de la Startup', title: 'Le Cerveau Entrepreneurial', subtitle: 'Neurosciences & Startup', content: ['VMPFC / Striatum: Reward-seeking, motivation, objectifs long-terme', 'Insula / Amygdala: Détection menaces, peur, anxiété', 'Équilibre entre approche et évitement', 'Le cerveau comme moteur d\'innovation'], type: 'content', image: anatomieImg },
  { id: 13, module: 'Anatomie de la Startup', title: 'L\'ADN: Culture & Valeurs', subtitle: 'Invisible mais Détermine Tout', content: ['Trust, Innovation, Integrity', 'Collaboration, Transparency, Resilience', 'Scalabilité saine vs dérive toxique (mutation)', 'L\'ADN de la startup: invisible mais détermine tout'], type: 'content', image: anatomieImg },
  { id: 14, module: 'Anatomie de la Startup', title: 'L\'Effectuation', subtitle: 'Saras Sarasvathy', content: ['Bird-in-Hand: Commencer avec ce qu\'on a', 'Affordable Loss: Perte acceptable', 'Crazy Quilt: Partenariats stratégiques', 'Lemonade: Transformer les surprises', 'Pilot-in-the-Plane: Contrôler l\'avenir'], type: 'content', image: anatomieImg },
  { id: 15, module: 'Anatomie de la Startup', title: 'La Destruction Créatrice', subtitle: 'Pr. Clayton Christensen', content: ['Le processus par lequel l\'innovation perturbe les marchés existants', 'Détruire l\'ancien pour créer le nouveau', 'Stimuler la croissance économique', 'Pain → Opportunity → Solution'], type: 'content', image: anatomieImg },
  { id: 16, module: 'Anatomie de la Startup', title: 'Définition de la Startup', subtitle: 'Steve Blank', content: ['"Une startup est une organisation temporaire à la recherche d\'un modèle économique permettant une croissance exponentielle"', 'Organisation temporaire', 'Recherche de modèle économique', 'Croissance exponentielle'], type: 'content', image: anatomieImg },
  { id: 17, module: 'Anatomie de la Startup', title: 'Les Yeux: Design Thinking', subtitle: 'Humaniser la Vision', content: ['Empathize → Define → Ideate → Prototype → Test', 'Observer → Focaliser → Imaginer → Tester la vision → Valider', 'Le Design Thinking = les yeux de la startup', 'Ils humanisent tout ce qu\'ils regardent'], type: 'content', image: anatomieImg },
  { id: 18, module: 'Anatomie de la Startup', title: 'Le Cœur: Lean Canvas', subtitle: 'Respirer au Rythme du Client', content: ['Inspirer: Hypothèses, Problème, Segment Client', 'Expirer: Cycle Build → Measure → Learn', 'Apnée = Moment dangereux (arrêt d\'écoute marché)', 'Le Lean Canvas respire au rythme du client'], type: 'content', image: anatomieImg },

  // Business Model & Lean Canvas (19-25)
  { id: 19, module: 'Business Model', title: 'Le Squelette: Business Model Canvas', subtitle: 'L\'Anatomie du Business Model', content: ['Colonne vertébrale: Proposition de valeur', 'Cage thoracique: Protection du cœur business', 'Bras: Canaux de distribution (atteindre le client)', 'Jambes: Relations clients (aller vers le marché)', 'Bassin: Ressources clés (fondation stable)'], type: 'content', image: businessModelImg },
  { id: 20, module: 'Business Model', title: 'BMC vs Lean Canvas', subtitle: 'Deux Outils, Deux Philosophies', content: ['BMC (L\'Architecte): Entreprises établies, marchés connus', 'Focus: Exécution, optimisation, description complète', 'Lean Canvas (L\'Explorateur): Startups, haute incertitude', 'Focus: Découverte, validation, itération rapide'], type: 'content', image: businessModelImg },
  { id: 21, module: 'Business Model', title: 'Arbre de Décision BMC vs Lean Canvas', subtitle: 'Quel Outil Choisir?', content: ['Problème bien défini et validé? → NON → Lean Canvas', 'OUI → Marché et clients bien connus?', 'NON → Lean Canvas (innovation marché existant)', 'OUI → Business Model Canvas (exécuter & optimiser)'], type: 'content', image: businessModelImg },
  { id: 22, module: 'Business Model', title: 'Du BMC au Lean Canvas', subtitle: 'Transformation des Blocs', content: ['Partenaires → Problème: Valider le besoin du marché', 'Activités → Solution MVP: Tester l\'hypothèse rapidement', 'Ressources → Indicateurs Clés: Mesurer le succès', 'Relations → Avantage Injuste: Ce qui rend unique'], type: 'content', image: businessModelImg },
  { id: 23, module: 'Business Model', title: 'Cycle de Maturité', subtitle: 'Du Lean Canvas au BMC', content: ['Phase 1: Création/Marché (Lean Canvas) - Incertitude élevée', 'Phase 2: Validation - Certitude croissante', 'Phase 3: Mise à échelle (BMC) - Stabilité', 'Phase 4: Maturité & Optimisation'], type: 'content', image: businessModelImg },
  { id: 24, module: 'Business Model', title: 'Lean Startup & MVP', subtitle: 'Eric Ries & Ash Maurya', content: ['Start small → Build MVP → Measure Data/Feedback', 'Learn → Riskiest assumptions first', 'Customer Interview → Problem Interview → Solution Interview', 'Minimum Viable Audience → Validated Learning'], type: 'content', image: businessModelImg },
  { id: 25, module: 'Business Model', title: 'Lean Startup en Images', subtitle: 'Build-Measure-Learn', content: ['Cycle itératif continu', 'Hypothèses → Expériences → Données', 'Apprentissage validé', 'Pivoter ou persévérer'], type: 'content', image: businessModelImg },

  // Exécution & Méthode Agile (26-28)
  { id: 26, module: 'Exécution Agile', title: 'Les Muscles: La Méthode Agile', subtitle: 'Flexibilité & Exécution', content: ['Product Backlog → Sprint (contraction rapide & ciblée)', 'Livraison de valeur → Itérations (mouvement continu)', 'Pivot: Réorientation sans déchirure', 'Waterfall = Rigidité = Risque de cassure', 'L\'agilité n\'est pas la vitesse, c\'est la capacité à changer de direction'], type: 'content', image: executionAgileImg },
  { id: 27, module: 'Exécution Agile', title: 'La Voix: Marketing des Startups', subtitle: 'Le Visage & La Voix', content: ['Le Visage: Branding, identité visuelle, logo, couleurs', 'Expressions faciales: Tone of voice, personnalité de marque', 'La Bouche: Storytelling, Pitch, Copywriting', 'Phéromones: Marketing émotionnel, désir inconscient', 'Langage corporel: Expérience utilisateur (UX)'], type: 'content', image: executionAgileImg },
  { id: 28, module: 'Exécution Agile', title: 'Les Hormones: C-Suite', subtitle: 'Le Système Endocrinien de la Startup', content: ['Hypothalamus = CEO: Régule tout, ordres stratégiques', 'Hypophyse = CTO: Coordination technique', 'Thyroïde = COO: Vitesse d\'exécution', 'Surrénales = CMO: Adrénaline, visibilité', 'Pancréas = CFO: Cash, budget', 'Glande Pinéale = Chief Vision Officer'], type: 'content', image: executionAgileImg },

  // Plateforme & Technologie (29-30)
  { id: 29, module: 'Plateforme Tech', title: 'La Peau: Plateforme Technologique', subtitle: 'Interface Intérieur/Extérieur', content: ['Premier contact: UI/UX', 'Ressent l\'extérieur: Feedback utilisateur, Analytics', 'Auto-régénération: Mises à jour, itérations, déploiement continu', 'Sécurité & Données', 'Versions: V1.0 → V2.0 → évolution continue'], type: 'content', image: plateformeTechImg },
  { id: 30, module: 'Plateforme Tech', title: 'Le Sang: Cash Flow', subtitle: 'La Circulation Vitale', content: ['Acquisition → Engagement → Rétention', 'Revenu → Efficacité → Croissance → Finance', 'Sans circulation sanguine (cash), le corps meurt'], type: 'content', image: plateformeTechImg },

  // Métriques (31-35)
  { id: 31, module: 'Métriques Startup', title: 'Métriques d\'Acquisition', subtitle: 'Attirer les Utilisateurs', content: ['CAC: Coût d\'Acquisition Client', 'VPA: Prix Viral', 'ROAS: Retour sur dépenses publicitaires', 'CPC/CPA/CPL: Coûts par action', 'VCF: Coefficient Viral'], type: 'content', image: metriquesImg },
  { id: 32, module: 'Métriques Startup', title: 'Métriques d\'Engagement', subtitle: 'Mesurer l\'Activité', content: ['DAU/WAU/MAU: Utilisateurs actifs', 'TTV: Time to Value', 'SES: Durée de session', 'SPU: Sessions par utilisateur', 'FTU: First-Time User Experience'], type: 'content', image: metriquesImg },
  { id: 33, module: 'Métriques Startup', title: 'Métriques de Rétention', subtitle: 'Garder les Utilisateurs', content: ['CHR: Taux d\'attrition (Churn Rate)', 'STK: Adhérence (Stickiness)', 'NRR: Rétention Nette', 'GRR: Rétention Brute', 'Rétention Jour 1/7/30'], type: 'content', image: metriquesImg },
  { id: 34, module: 'Métriques Startup', title: 'Métriques de Revenu', subtitle: 'Mesurer la Monétisation', content: ['ARPU/ARPA: Revenu moyen par utilisateur/compte', 'MRR/ARR: Revenu mensuel/annuel récurrent', 'GMV: Volume brut de marchandises', 'NSM: North Star Metric', 'PQL: Product Qualified Leads'], type: 'content', image: metriquesImg },
  { id: 35, module: 'Métriques Startup', title: 'KPIs Financiers', subtitle: 'Santé Financière', content: ['LTV: Valeur vie client', 'LTV/CAC: Ratio de rentabilité', 'Burn Rate & Runway', 'EBITDA & Marge brute', 'TAM/SAM/SOM: Taille de marché', 'BEP: Seuil de rentabilité'], type: 'content', image: metriquesImg },

  // Conclusion (36)
  { id: 36, module: 'Conclusion', title: 'Récapitulatif', subtitle: 'L\'Anatomie Complète', content: ['Cerveau: Mental Model & Imagination', 'Yeux: Design Thinking', 'Cœur: Lean Canvas', 'Squelette: Business Model Canvas', 'Muscles: Méthode Agile', 'Voix: Marketing', 'Sang: Cash Flow & Métriques', 'Peau: Plateforme Tech', 'ADN: Culture & Valeurs'], type: 'summary', image: anatomieImg },
];
