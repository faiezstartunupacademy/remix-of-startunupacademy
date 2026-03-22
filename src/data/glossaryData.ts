// Startup Glossary Data - extracted for reuse in search index
export interface GlossaryTerm {
  term: string;
  category: string;
  definition: string;
  details: string;
  example: string;
}

export const glossaryTerms: GlossaryTerm[] = [
  // Financement - Investisseurs
  { term: "Angel Investor", category: "Financement", definition: "Individu fortuné qui investit son propre capital dans des startups en phase de démarrage en échange d'une participation minoritaire.", details: "Contrairement aux fonds de capital-risque, les angels investissent leur argent personnel et prennent souvent un rôle actif dans le mentorat. Investissement typique: 25k-500k€.", example: "Ron Conway, investisseur dans Google, PayPal et Facebook" },
  { term: "Super Angel", category: "Financement", definition: "Investisseur providentiel expérimenté qui a évolué vers un fonds de capital-risque tout en conservant des caractéristiques d'angel investing.", details: "Gère un fonds et fait des investissements multiples. Combine l'agilité des angels avec la capacité des VCs.", example: "Naval Ravikant (AngelList), Ron Conway (SV Angel)" },
  { term: "Angel Group", category: "Financement", definition: "Collectif d'investisseurs providentiels qui investissent ensemble dans des startups en phase de démarrage.", details: "Permet de mutualiser les ressources, partager les risques et accéder à des opportunités plus importantes.", example: "Paris Business Angels, AngelList, 500 Startups" },
  { term: "Venture Capital (VC)", category: "Financement", definition: "Fonds d'investissement spécialisé dans le financement de startups à fort potentiel de croissance en échange de participations significatives.", details: "Investissent entre 1M€ et 50M€+, participent activement à la gouvernance, ont un horizon de 7-10 ans.", example: "Sequoia (Google, WhatsApp), a16z (Facebook, Airbnb)" },
  { term: "Limited Partner (LP)", category: "Financement", definition: "Investisseur passif qui apporte du capital à un fonds de capital-risque sans participer à sa gestion.", details: "Fournissent 99% du capital, reçoivent 80% des gains. Types: fonds de pension, fondations, family offices.", example: "Yale University Endowment, CalPERS" },
  { term: "General Partner (GP)", category: "Financement", definition: "Gestionnaire actif d'un fonds de capital-risque qui prend les décisions d'investissement et gère le portefeuille.", details: "Apportent 1% du capital, reçoivent 20% des gains (carried interest) + 2% de frais de gestion annuels.", example: "Marc Andreessen chez a16z, Peter Thiel chez Founders Fund" },
  { term: "Bootstrapped", category: "Financement", definition: "Startup financée uniquement par les fondateurs, sans apport externe de capital-risque ou d'investisseurs.", details: "L'entreprise se développe grâce à ses propres revenus et aux économies des fondateurs. Avantages: contrôle total, pas de dilution.", example: "Mailchimp (racheté $12Mds), Atlassian (démarré avec $10k)" },
  { term: "Crowdfunding", category: "Financement", definition: "Méthode de levée de fonds où de nombreux contributeurs investissent de petites sommes via des plateformes en ligne.", details: "Types: Récompense (produits/services), Equity (parts), Prêt (avec intérêt).", example: "Pebble Time (20,3M$ sur Kickstarter), Oculus Rift (2,4M$)" },
  { term: "Bridge Loan", category: "Financement", definition: "Prêt à court terme utilisé pour combler un besoin de trésorerie en attendant un financement plus important.", details: "Durée typique: 6-12 mois. Taux d'intérêt plus élevé. Souvent convertible en equity.", example: "Financement entre Série A et Série B" },
  { term: "Friends & Family Round", category: "Financement", definition: "Première levée de fonds auprès de proches (amis, famille, collègues) pour démarrer votre projet.", details: "Montant typique: 10k-150k€. Dilution: 5-20%.", example: "Jeff Bezos a levé $300k auprès de ses parents pour Amazon" },
  // Phases
  { term: "Pre-Seed", category: "Phases", definition: "Première phase de financement pour transformer une idée en prototype ou MVP.", details: "Montant: 50k-500k€. Sources: épargne, F&F, grants, angels.", example: "Financement pour développer le premier prototype" },
  { term: "Seed Round", category: "Phases", definition: "Tour de financement initial pour valider le produit et trouver le product-market fit.", details: "Montant: 500k-2M€. Valorisation: 2-10M€. Dilution: 15-25%.", example: "Dropbox Seed: $1,2M en 2007" },
  { term: "Series A", category: "Phases", definition: "Premier tour institutionnel majeur pour accélérer la croissance après validation du modèle.", details: "Montant: 2-15M€. Valorisation: 10-40M€.", example: "Instagram Série A: $7M avec Benchmark" },
  { term: "Series B", category: "Phases", definition: "Tour de financement pour accélérer la croissance et l'expansion de marché.", details: "Montant: 15-50M€. Valorisation: 50-200M€.", example: "Uber Série B: $258M en 2013" },
  // Concepts
  { term: "Capital", category: "Concepts", definition: "Ressources financières disponibles pour les opérations quotidiennes et le développement futur d'une entreprise.", details: "Sources: bootstrapping, F&F, angels, VCs, dette, crowdfunding.", example: "Capital de travail pour financer le BFR" },
  { term: "Dilution", category: "Concepts", definition: "Réduction du pourcentage de propriété des actionnaires existants lors de l'émission de nouvelles actions.", details: "Formule: (Nouvelles actions / Total après émission) × 100.", example: "Levée de 500k€ sur 1M€ de valorisation = 33% de dilution" },
  { term: "Cap Table", category: "Concepts", definition: "Document détaillant la répartition des actions et la propriété d'une entreprise.", details: "Essentiel pour: levées de fonds, calcul de dilution, conformité légale, sorties.", example: "Fondateurs 60%, Angels 15%, ESOP 10%, VCs 15%" },
  { term: "Due Diligence", category: "Concepts", definition: "Processus d'investigation approfondie d'une startup avant un investissement.", details: "Analyse: finances, légal, marché, équipe, technologie, clients. Durée: 2-8 semaines.", example: "Vérification des contrats, brevets, comptabilité avant Série A" },
  { term: "Runway", category: "Concepts", definition: "Durée pendant laquelle une startup peut opérer avec ses réserves de trésorerie actuelles.", details: "Calcul: Trésorerie / Burn rate mensuel. Idéal: 18-24 mois.", example: "500k€ de trésorerie / 50k€ burn = 10 mois de runway" },
  { term: "Burn Rate", category: "Concepts", definition: "Vitesse à laquelle une startup dépense ses réserves de trésorerie avant d'atteindre la rentabilité.", details: "Gross burn: dépenses totales. Net burn: dépenses - revenus.", example: "100k€ de dépenses - 40k€ de revenus = 60k€ net burn" },
  // Métriques
  { term: "CAC (Customer Acquisition Cost)", category: "Métriques", definition: "Coût total pour acquérir un nouveau client.", details: "Calcul: (Marketing + Ventes) / Nouveaux clients.", example: "50k€ marketing / 100 clients = 500€ CAC" },
  { term: "LTV (Lifetime Value)", category: "Métriques", definition: "Revenu total attendu d'un client sur toute la durée de la relation.", details: "Calcul: Revenu moyen × Durée de vie client. Règle d'or: LTV > 3× CAC.", example: "100€/mois × 24 mois = 2400€ LTV" },
  { term: "Activation", category: "Métriques", definition: "Moment où un utilisateur découvre la valeur principale de votre produit.", details: "Objectif: transformer les utilisateurs en clients.", example: "Facebook: ajout de 7 amis en 10 jours" },
  { term: "Retention", category: "Métriques", definition: "Capacité à conserver les clients sur une période donnée.", details: "Formule: Clients conservés / Clients initiaux.", example: "Taux de rétention 90% à 12 mois" },
  { term: "Churn Rate", category: "Métriques", definition: "Taux de clients qui cessent d'utiliser votre produit sur une période donnée.", details: "Churn mensuel acceptable: <5% pour B2C, <2% pour B2B.", example: "100 clients perdus / 1000 clients = 10% churn" },
  // Produit
  { term: "MVP (Minimum Viable Product)", category: "Produit", definition: "Version du produit avec les fonctionnalités essentielles pour tester l'idée auprès des premiers utilisateurs.", details: "Objectif: valider rapidement. Approche: itérative, basée sur feedback.", example: "Dropbox: vidéo de démonstration avant le produit réel" },
  { term: "Product-Market Fit", category: "Produit", definition: "Adéquation entre un produit et un besoin réel du marché.", details: "Indicateurs: taux de rétention élevé, croissance organique, NPS >40.", example: "Slack: résolution du problème de communication d'équipe" },
  { term: "Pivot", category: "Produit", definition: "Changement stratégique significatif du modèle d'affaires basé sur l'apprentissage.", details: "Types: modèle, marché, technologie, plateforme.", example: "Instagram: pivot de Burbn (géolocalisation) vers partage photos" },
  { term: "Scalability", category: "Produit", definition: "Capacité d'un produit à gérer une croissance sans dégradation de performance.", details: "Types: technique, organisationnelle, financière.", example: "Architecture cloud pour expansion mondiale" },
  // Croissance
  { term: "Growth Hacking", category: "Croissance", definition: "Approche multidisciplinaire combinant marketing, données et technologie pour une croissance rapide et peu coûteuse.", details: "Principes: expérimentation continue, A/B testing, analyse de données.", example: "Dropbox: programme de parrainage (16M utilisateurs en 15 mois)" },
  { term: "Hockey Stick Growth", category: "Croissance", definition: "Croissance exponentielle après une période de développement lent, formant une courbe en forme de bâton de hockey.", details: "Signe: Product-Market Fit atteint.", example: "Facebook après ouverture au grand public" },
  { term: "Scaling", category: "Croissance", definition: "Mise à l'échelle: croissance durable sans perte de qualité ou d'efficacité.", details: "Défi: maintenir la culture et la qualité.", example: "Uber: expansion de San Francisco à 60+ pays" },
  // Général
  { term: "Unicorn", category: "Général", definition: "Startup privée valorisée à plus d'1 milliard de dollars.", details: "Rareté: moins de 1000 au niveau mondial.", example: "Airbnb, Uber, Stripe, SpaceX" },
  { term: "Disruption", category: "Général", definition: "Innovation qui modifie radicalement un marché établi en redéfinissant les règles du jeu.", details: "Approche: bas prix, simplicité, accessibilité.", example: "Netflix vs location de DVD, Uber vs taxis traditionnels" },
  { term: "Value Proposition", category: "Général", definition: "Promesse de valeur unique que votre produit offre aux clients pour résoudre un problème spécifique.", details: "Éléments: bénéfices, différenciation, preuve.", example: "Slack: 'Moins d'e-mails, plus de productivité'" },
  { term: "Competitive Advantage", category: "Général", definition: "Facteur distinctif qui vous différencie de la concurrence de manière durable.", details: "Types: coût, différenciation, focus.", example: "Apple: écosystème intégré, Amazon: logistique" },
  // Modèles
  { term: "B2B (Business to Business)", category: "Modèles", definition: "Modèle où l'entreprise vend des produits ou services à d'autres entreprises.", details: "Caractéristiques: cycles de vente longs, contrats importants, relation personnalisée, LTV élevée.", example: "Salesforce, Slack, Microsoft" },
  { term: "B2C (Business to Consumer)", category: "Modèles", definition: "Modèle où l'entreprise vend directement aux consommateurs finaux.", details: "Caractéristiques: volume élevé, prix unitaire bas, marketing de masse.", example: "Amazon, Netflix, Spotify" },
  { term: "SaaS (Software as a Service)", category: "Modèles", definition: "Modèle de distribution de logiciels accessibles via internet avec abonnement récurrent.", details: "Avantages: revenus récurrents prévisibles, mise à jour continue, scalabilité.", example: "Salesforce, Dropbox, HubSpot" },
  { term: "Marketplace", category: "Modèles", definition: "Plateforme qui met en relation acheteurs et vendeurs en prenant une commission sur les transactions.", details: "Défi: problème de la poule et l'œuf. Effet réseau puissant.", example: "Airbnb, Uber, eBay" },
  { term: "Freemium", category: "Modèles", definition: "Modèle offrant une version gratuite limitée pour convertir vers une version payante premium.", details: "Taux de conversion typique: 2-5%.", example: "Spotify, Dropbox, LinkedIn" },
];

export const glossaryCategories = [
  { name: "Tous", color: "bg-primary" },
  { name: "Financement", color: "bg-green-500" },
  { name: "Phases", color: "bg-blue-500" },
  { name: "Concepts", color: "bg-purple-500" },
  { name: "Métriques", color: "bg-orange-500" },
  { name: "Produit", color: "bg-rose-500" },
  { name: "Croissance", color: "bg-amber-500" },
  { name: "Général", color: "bg-teal-500" },
  { name: "Modèles", color: "bg-indigo-500" },
];
