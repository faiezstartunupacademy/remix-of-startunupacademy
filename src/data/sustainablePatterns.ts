// 45 Sustainable Business Model Patterns - Lüdeke-Freund et al.
export interface SustainablePattern {
  id: number;
  symbol: string;
  groupe: string;
  nom: string;
  description: string;
  objectif_durable: string;
}

export const SUSTAINABLE_PATTERNS_DATA: SustainablePattern[] = [
  // Pricing & Revenue (Prix et Revenus)
  { id: 1, symbol: "TD", groupe: "Pricing & Revenue", nom: "Tarification Différenciée", description: "Appliquer des prix différents pour le même produit en fonction de la capacité de paiement du client.", objectif_durable: "Permettre l'accès aux produits essentiels pour les populations à faible revenu (équité sociale)." },
  { id: 2, symbol: "TS", groupe: "Pricing & Revenue", nom: "Tarification au Succès", description: "Le client ne paie que si le produit ou service atteint un résultat convenu.", objectif_durable: "Réduire le risque pour le client et aligner les intérêts sur l'efficacité réelle (souvent énergétique)." },
  { id: 3, symbol: "FS", groupe: "Pricing & Revenue", nom: "Freemium Social", description: "Une version de base gratuite financée par des utilisateurs premium payants.", objectif_durable: "Démocratiser l'accès à un service (souvent numérique ou éducatif) pour le plus grand nombre." },
  
  // Financing (Financement)
  { id: 4, symbol: "CF", groupe: "Financing", nom: "Crowdfunding", description: "Financement d'un projet par un grand nombre de personnes via une plateforme en ligne.", objectif_durable: "Mobiliser une communauté autour de valeurs éthiques et valider le marché avant production." },
  { id: 5, symbol: "II", groupe: "Financing", nom: "Investissement à Impact", description: "Attirer des capitaux qui cherchent explicitement un retour social/environnemental en plus du financier.", objectif_durable: "Financer des projets à long terme souvent ignorés par la finance traditionnelle." },
  { id: 6, symbol: "SP", groupe: "Financing", nom: "Sponsorship", description: "Une entité tierce finance le produit pour qu'il soit gratuit ou moins cher pour l'utilisateur final.", objectif_durable: "Rendre accessible des biens publics ou sociaux (santé, éducation)." },
  
  // Eco-Design (Éco-conception)
  { id: 7, symbol: "SM", groupe: "Eco-Design", nom: "Substitution de Matériaux", description: "Remplacer des matériaux toxiques ou rares par des matériaux renouvelables ou bénins.", objectif_durable: "Réduire la toxicité et l'empreinte écologique des produits." },
  { id: 8, symbol: "DR", groupe: "Eco-Design", nom: "Design pour la Réparabilité", description: "Concevoir des produits faciles à démonter et à réparer.", objectif_durable: "Allonger la durée de vie du produit et lutter contre l'obsolescence programmée." },
  { id: 9, symbol: "ER", groupe: "Eco-Design", nom: "Efficacité des Ressources", description: "Faire plus avec moins de ressources (dématérialisation, allègement).", objectif_durable: "Minimiser l'extraction de ressources naturelles." },
  { id: 10, symbol: "BM", groupe: "Eco-Design", nom: "Biomimétisme", description: "S'inspirer de la nature pour concevoir des produits et processus.", objectif_durable: "Créer des solutions naturellement efficaces et durables." },
  { id: 11, symbol: "DM", groupe: "Eco-Design", nom: "Design Modulaire", description: "Créer des produits composés de modules indépendants interchangeables.", objectif_durable: "Faciliter la mise à niveau et la réparation ciblée sans jeter tout le produit." },
  
  // Closing-the-Loop (Boucler la boucle)
  { id: 12, symbol: "C2C", groupe: "Closing-the-Loop", nom: "Cradle-to-Cradle", description: "Conception où tous les intrants peuvent être soit recyclés techniquement, soit compostés biologiquement.", objectif_durable: "Éliminer la notion de déchet." },
  { id: 13, symbol: "TB", groupe: "Closing-the-Loop", nom: "Système de Reprise", description: "L'entreprise récupère ses produits en fin de vie.", objectif_durable: "Assurer le recyclage ou le reconditionnement correct des produits." },
  { id: 14, symbol: "UC", groupe: "Closing-the-Loop", nom: "Upcycling", description: "Utiliser les déchets d'un processus comme matière première pour un autre.", objectif_durable: "Réduire les déchets et les coûts de matières premières." },
  { id: 15, symbol: "SI", groupe: "Closing-the-Loop", nom: "Symbiose Industrielle", description: "Coopération entre entreprises proches où les déchets de l'une deviennent les ressources de l'autre.", objectif_durable: "Optimisation régionale des ressources et de l'énergie." },
  { id: 16, symbol: "RM", groupe: "Closing-the-Loop", nom: "Remanufacturing", description: "Remettre un produit usagé à neuf avec une garantie équivalente.", objectif_durable: "Préserver la valeur ajoutée et l'énergie grise du produit initial." },
  
  // Supply Chain (Chaîne d'approvisionnement)
  { id: 17, symbol: "AI", groupe: "Supply Chain", nom: "Approvisionnement Inclusif", description: "Intégrer des petits producteurs ou des communautés marginalisées dans la chaîne de valeur.", objectif_durable: "Développement économique local et réduction de la pauvreté." },
  { id: 18, symbol: "CE", groupe: "Supply Chain", nom: "Commerce Équitable", description: "Payer un prix juste et garantir des conditions de travail décentes aux producteurs.", objectif_durable: "Justice sociale et stabilité économique pour les producteurs." },
  { id: 19, symbol: "AL", groupe: "Supply Chain", nom: "Approvisionnement Local", description: "Privilégier les fournisseurs situés à proximité du lieu de production ou de consommation.", objectif_durable: "Réduire l'empreinte carbone logistique et soutenir l'économie locale." },
  { id: 20, symbol: "GS", groupe: "Supply Chain", nom: "Green Supply Chain", description: "Imposer des standards environnementaux stricts à tous les fournisseurs.", objectif_durable: "Réduire l'impact écologique global, pas seulement interne." },
  
  // Giving (Don et Partage)
  { id: 21, symbol: "B1G1", groupe: "Giving", nom: "Buy One Give One", description: "Pour chaque produit vendu, un produit équivalent est donné à une personne dans le besoin.", objectif_durable: "Répondre aux besoins immédiats des populations démunies." },
  { id: 22, symbol: "CH", groupe: "Giving", nom: "Charité / Philanthropie", description: "Donner une partie des profits à des causes caritatives.", objectif_durable: "Soutien financier aux ONG et causes sociales." },
  
  // Access Provision (Fourniture d'accès)
  { id: 23, symbol: "EP", groupe: "Access Provision", nom: "Économie du Partage", description: "Permettre aux utilisateurs de partager des ressources sous-utilisées (C2C ou B2C).", objectif_durable: "Maximiser l'utilisation des actifs existants." },
  { id: 24, symbol: "LO", groupe: "Access Provision", nom: "Location", description: "Payer pour l'accès temporaire à un produit plutôt que pour sa propriété.", objectif_durable: "Réduire la surproduction en intensifiant l'usage d'un même bien." },
  { id: 25, symbol: "LE", groupe: "Access Provision", nom: "Leasing", description: "Contrat de location longue durée, souvent avec services inclus (maintenance).", objectif_durable: "Responsabiliser le fabricant sur la durée de vie et la fin de vie du produit." },
  { id: 26, symbol: "PPU", groupe: "Access Provision", nom: "Paiement à l'Usage", description: "Le client paie pour chaque utilisation spécifique du produit.", objectif_durable: "Inciter à une consommation rationnelle et mesurée." },
  { id: 27, symbol: "AB", groupe: "Access Provision", nom: "Abonnement", description: "Accès continu à un service ou produit contre un paiement récurrent.", objectif_durable: "Stabilité financière permettant d'investir dans la qualité et la durabilité." },
  
  // Social Mission (Mission Sociale)
  { id: 28, symbol: "BoP", groupe: "Social Mission", nom: "Base de la Pyramide", description: "Concevoir des produits spécifiquement pour les populations les plus pauvres.", objectif_durable: "Lutter contre la pauvreté par l'inclusion économique." },
  { id: 29, symbol: "FrS", groupe: "Social Mission", nom: "Franchise Sociale", description: "Utiliser le modèle de franchise pour dupliquer une entreprise à impact social.", objectif_durable: "Mise à l'échelle rapide de solutions sociales éprouvées." },
  { id: 30, symbol: "EE", groupe: "Social Mission", nom: "Emploi des Exclus", description: "La mission principale est d'employer des personnes éloignées du marché du travail.", objectif_durable: "Réinsertion sociale et professionnelle." },
  { id: 31, symbol: "ESS", groupe: "Social Mission", nom: "Entreprise de Service Social", description: "Fournir des services sociaux (santé, éducation) là où l'État est défaillant.", objectif_durable: "Combler les lacunes des services publics essentiels." },
  
  // Service Performance (Performance de Service)
  { id: 32, symbol: "PSP", groupe: "Service Performance", nom: "PSS Orienté Produit", description: "Vendre un produit avec des services additionnels (maintenance, formation) pour en prolonger la vie.", objectif_durable: "Assurer le bon fonctionnement et la longévité du produit." },
  { id: 33, symbol: "PSU", groupe: "Service Performance", nom: "PSS Orienté Usage", description: "Le fournisseur reste propriétaire, le client achète l'usage (ex: autopartage).", objectif_durable: "Intensification de l'usage des ressources." },
  { id: 34, symbol: "PSR", groupe: "Service Performance", nom: "PSS Orienté Résultat", description: "Le client achète un résultat (ex: confort thermique) et non l'énergie ou le chauffage.", objectif_durable: "Le fournisseur est incité à minimiser les ressources pour maximiser sa marge." },
  { id: 35, symbol: "CPE", groupe: "Service Performance", nom: "Contrat de Performance", description: "Les économies d'énergie réalisées remboursent l'investissement initial.", objectif_durable: "Réduction drastique de la consommation énergétique des bâtiments/usines." },
  { id: 36, symbol: "CMS", groupe: "Service Performance", nom: "Gestion Chimique", description: "Le fournisseur gère les produits chimiques chez le client et est payé à la qualité du service, pas au volume.", objectif_durable: "Réduction des volumes de produits chimiques utilisés." },
  
  // Cooperative (Coopérative)
  { id: 37, symbol: "CC", groupe: "Cooperative", nom: "Coopérative de Consommateurs", description: "Les clients possèdent et gèrent l'entreprise.", objectif_durable: "Produits répondant aux vrais besoins, prix justes, ancrage local." },
  { id: 38, symbol: "CP", groupe: "Cooperative", nom: "Coopérative de Producteurs", description: "Les producteurs (ex: agriculteurs) se regroupent pour mutualiser les outils et la vente.", objectif_durable: "Maintien de l'agriculture locale, pouvoir de négociation accru." },
  { id: 39, symbol: "AS", groupe: "Cooperative", nom: "Actionnariat Salarié", description: "Les employés possèdent l'entreprise.", objectif_durable: "Conditions de travail justes, réduction des inégalités de revenus." },
  
  // Community Platform (Plateforme Communautaire)
  { id: 40, symbol: "P2P", groupe: "Community Platform", nom: "Peer-to-Peer", description: "Plateforme mettant en relation directe des individus pour échanger biens ou services.", objectif_durable: "Renforcement du lien social et économie circulaire locale." },
  { id: 41, symbol: "CS", groupe: "Community Platform", nom: "Crowdsourcing", description: "Externaliser des tâches à une foule d'individus, souvent pour l'innovation.", objectif_durable: "Innovation ouverte et résolution collective de problèmes complexes." },
  { id: 42, symbol: "OS", groupe: "Community Platform", nom: "Open Source", description: "Rendre les plans, codes ou designs accessibles à tous gratuitement.", objectif_durable: "Accélération de l'innovation durable mondiale par le partage de connaissances." },
  { id: 43, symbol: "OD", groupe: "Community Platform", nom: "Open Data", description: "Partager les données environnementales ou sociales pour encourager la transparence.", objectif_durable: "Transparence et création de nouveaux services par la communauté." },
  { id: 44, symbol: "EL", groupe: "Community Platform", nom: "E-Learning Social", description: "Plateformes éducatives accessibles favorisant l'échange entre apprenants.", objectif_durable: "Éducation pour tous et diffusion des savoirs durables." },
  { id: 45, symbol: "MVL", groupe: "Community Platform", nom: "Marché Virtuel Local", description: "Plateforme connectant producteurs et consommateurs d'une même région.", objectif_durable: "Réduction des circuits logistiques et soutien à l'économie locale." }
];

// Categories for filtering
export const SUSTAINABLE_CATEGORIES = [
  { key: 'all', label: 'Tous', color: 'bg-slate-500', count: 45 },
  { key: 'Pricing & Revenue', label: 'Prix & Revenus', color: 'bg-violet-500', count: 3 },
  { key: 'Financing', label: 'Financement', color: 'bg-indigo-500', count: 3 },
  { key: 'Eco-Design', label: 'Éco-Design', color: 'bg-emerald-500', count: 5 },
  { key: 'Closing-the-Loop', label: 'Circularité', color: 'bg-teal-500', count: 5 },
  { key: 'Supply Chain', label: 'Supply Chain', color: 'bg-sky-500', count: 4 },
  { key: 'Giving', label: 'Don', color: 'bg-pink-500', count: 2 },
  { key: 'Access Provision', label: 'Accès', color: 'bg-amber-500', count: 5 },
  { key: 'Social Mission', label: 'Social', color: 'bg-rose-500', count: 4 },
  { key: 'Service Performance', label: 'Performance', color: 'bg-cyan-500', count: 5 },
  { key: 'Cooperative', label: 'Coopérative', color: 'bg-orange-500', count: 3 },
  { key: 'Community Platform', label: 'Communauté', color: 'bg-fuchsia-500', count: 6 },
];

// Helper function to get group color
export const getSustainableGroupColor = (groupe: string): string => {
  const category = SUSTAINABLE_CATEGORIES.find(cat => cat.key === groupe);
  return category?.color || 'bg-slate-500';
};
