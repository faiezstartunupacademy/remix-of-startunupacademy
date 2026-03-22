import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Youtube, Headphones, Star, ExternalLink, Award,
  Globe, Clock, Users, TrendingUp, Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ResourceCategory = "books" | "youtube" | "podcasts";

type Resource = {
  title: string;
  author: string;
  description: string;
  whyImportant: string;
  language: string;
  url?: string;
  year?: number;
  rating: number; // 1-5
  tags: string[];
  audience: string;
  duration?: string;
};

const BOOKS: Resource[] = [
  {
    title: "The Lean Startup",
    author: "Eric Ries",
    description: "Méthodologie Build-Measure-Learn pour créer des startups avec un minimum de gaspillage. Le livre fondateur du mouvement Lean.",
    whyImportant: "C'est LA référence absolue. Chaque fondateur doit comprendre le cycle itératif avant de coder une seule ligne. Ce livre a transformé la façon dont le monde entier crée des entreprises.",
    language: "🇬🇧 EN / 🇫🇷 FR",
    year: 2011,
    rating: 5,
    tags: ["MVP", "Lean", "Itération", "Validation"],
    audience: "Tout fondateur — lecture obligatoire",
    url: "https://theleanstartup.com",
  },
  {
    title: "Zero to One",
    author: "Peter Thiel",
    description: "Passer de 0 à 1 (créer quelque chose de nouveau) vs de 1 à n (copier). Vision contrarian sur l'innovation monopolistique.",
    whyImportant: "Thiel force à penser en termes de monopole créatif plutôt que de compétition. Indispensable pour comprendre la création de valeur radicale.",
    language: "🇬🇧 EN / 🇫🇷 FR",
    year: 2014,
    rating: 5,
    tags: ["Vision", "Monopole", "Innovation", "Stratégie"],
    audience: "Fondateurs ambitieux, deep-tech",
    url: "https://zerotoonebook.com",
  },
  {
    title: "The Mom Test",
    author: "Rob Fitzpatrick",
    description: "Comment parler aux clients et apprendre si votre business est une bonne idée quand tout le monde vous ment.",
    whyImportant: "Court, pratique, essentiel. 90% des fondateurs font des interviews clients incorrectes. Ce livre corrige ça en 2h de lecture.",
    language: "🇬🇧 EN / 🇫🇷 FR",
    year: 2013,
    rating: 5,
    tags: ["Customer Discovery", "Interview", "Validation", "Pratique"],
    audience: "Tout fondateur en phase early-stage",
  },
  {
    title: "Business Model Generation",
    author: "Alexander Osterwalder & Yves Pigneur",
    description: "Le Business Model Canvas expliqué avec 470 exemples visuels. Le standard mondial pour concevoir des modèles d'affaires.",
    whyImportant: "Le BMC est devenu le langage universel des startups et des grandes entreprises. Ce livre rend la stratégie visuelle et accessible.",
    language: "🇬🇧 EN / 🇫🇷 FR",
    year: 2010,
    rating: 5,
    tags: ["Business Model", "Canvas", "Stratégie", "Visuel"],
    audience: "Fondateurs, consultants, étudiants",
  },
  {
    title: "Crossing the Chasm",
    author: "Geoffrey Moore",
    description: "Comment franchir le gouffre entre les early adopters et le marché de masse. Le modèle de diffusion technologique.",
    whyImportant: "Explique pourquoi tant de startups meurent après un bon démarrage. Le concept du 'chasm' est fondamental pour tout go-to-market.",
    language: "🇬🇧 EN / 🇫🇷 FR",
    year: 1991,
    rating: 5,
    tags: ["Go-to-Market", "Adoption", "Scale", "B2B"],
    audience: "Startups tech en phase de croissance",
  },
  {
    title: "The Hard Thing About Hard Things",
    author: "Ben Horowitz",
    description: "Les réalités brutales de la direction d'une startup : licenciements, pivots, crises. Sans filtre.",
    whyImportant: "Le seul livre qui parle honnêtement de la souffrance entrepreneuriale. Chaque fondateur traverse ces moments — ce livre vous y prépare.",
    language: "🇬🇧 EN / 🇫🇷 FR",
    year: 2014,
    rating: 5,
    tags: ["Leadership", "Résilience", "Management", "Crise"],
    audience: "CEO, fondateurs expérimentés",
  },
  {
    title: "Blitzscaling",
    author: "Reid Hoffman & Chris Yeh",
    description: "L'art de la croissance ultra-rapide. Comment et pourquoi certaines startups priorisent la vitesse sur l'efficacité.",
    whyImportant: "Indispensable pour comprendre la logique de croissance de LinkedIn, Airbnb, Uber. La vitesse comme avantage compétitif.",
    language: "🇬🇧 EN / 🇫🇷 FR",
    year: 2018,
    rating: 4,
    tags: ["Scale", "Croissance", "Réseau", "Vitesse"],
    audience: "Startups en phase de scaling",
  },
  {
    title: "Disciplined Entrepreneurship",
    author: "Bill Aulet (MIT)",
    description: "24 étapes structurées pour créer une startup, développées au MIT. Méthodologie rigoureuse et complète.",
    whyImportant: "La méthode la plus structurée qui existe. Parfaite pour les ingénieurs et les esprits analytiques qui veulent un framework complet.",
    language: "🇬🇧 EN",
    year: 2013,
    rating: 4,
    tags: ["Méthodologie", "MIT", "24 étapes", "Structuré"],
    audience: "Étudiants, ingénieurs-entrepreneurs",
  },
  {
    title: "Inspired",
    author: "Marty Cagan",
    description: "Comment créer des produits tech que les clients adorent. La bible du product management.",
    whyImportant: "Si vous construisez un produit tech, ce livre définit les meilleures pratiques de product management utilisées par Google, Apple, Netflix.",
    language: "🇬🇧 EN / 🇫🇷 FR",
    year: 2017,
    rating: 4,
    tags: ["Product", "UX", "Discovery", "Agile"],
    audience: "Product Managers, CTO, fondateurs tech",
  },
  {
    title: "Running Lean",
    author: "Ash Maurya",
    description: "Comment itérer du Plan A à un plan qui marche. Lean Canvas + validation systématique.",
    whyImportant: "Le compagnon pratique du Lean Startup. Plus actionnable, avec le Lean Canvas comme outil central.",
    language: "🇬🇧 EN / 🇫🇷 FR",
    year: 2012,
    rating: 4,
    tags: ["Lean Canvas", "Validation", "Itération", "Pratique"],
    audience: "Fondateurs early-stage",
  },
  {
    title: "The Startup Owner's Manual",
    author: "Steve Blank & Bob Dorf",
    description: "Le guide étape par étape du Customer Development. 600+ pages de méthodologie détaillée.",
    whyImportant: "Steve Blank est le père du Customer Development. Ce manuel est la référence la plus complète pour valider un business.",
    language: "🇬🇧 EN",
    year: 2012,
    rating: 4,
    tags: ["Customer Development", "Validation", "B2B", "B2C"],
    audience: "Fondateurs méthodiques",
  },
  {
    title: "Hooked",
    author: "Nir Eyal",
    description: "Le modèle Hook : Trigger → Action → Reward → Investment. Comment créer des produits addictifs.",
    whyImportant: "Comprendre la psychologie de l'engagement est critique pour la rétention. Ce modèle est utilisé par toutes les apps à succès.",
    language: "🇬🇧 EN / 🇫🇷 FR",
    year: 2014,
    rating: 4,
    tags: ["Engagement", "Rétention", "Psychologie", "Product"],
    audience: "Product designers, fondateurs d'apps",
  },
  {
    title: "The Four Steps to the Epiphany",
    author: "Steve Blank",
    description: "Le livre fondateur du Customer Development. Les 4 étapes : Customer Discovery, Validation, Creation, Building.",
    whyImportant: "C'est LE livre qui a lancé tout le mouvement Lean Startup. Eric Ries était l'étudiant de Steve Blank. Sans ce livre, rien de ce qu'on connaît n'existerait.",
    language: "🇬🇧 EN",
    year: 2005,
    rating: 5,
    tags: ["Customer Development", "Fondateur", "Méthodologie", "Origines"],
    audience: "Tout fondateur — lecture historique essentielle",
    url: "https://steveblank.com/books-for-startups/",
  },
];

const YOUTUBE_CHANNELS: Resource[] = [
  {
    title: "Steve Blank",
    author: "Steve Blank",
    description: "Le père du Customer Development et du Lean Startup. Cours, conférences et analyses stratégiques sur l'entrepreneuriat.",
    whyImportant: "Steve Blank a littéralement inventé la méthodologie moderne des startups. Sa chaîne contient des décennies de sagesse condensée. Ses cours de Stanford/Berkeley sont gratuits ici.",
    language: "🇬🇧 EN",
    rating: 5,
    tags: ["Customer Development", "Lean", "Stanford", "Méthodologie"],
    audience: "Tout fondateur — ressource fondatrice",
    url: "https://www.youtube.com/@steveblank",
  },
  {
    title: "Y Combinator",
    author: "YC (Sam Altman, Michael Seibel, etc.)",
    description: "Startup School, How to Start a Startup, et des centaines de talks des meilleurs fondateurs au monde.",
    whyImportant: "YC a incubé Airbnb, Stripe, Dropbox. Leur contenu gratuit vaut plus que n'importe quel MBA. La série 'How to Start a Startup' est un cours complet.",
    language: "🇬🇧 EN",
    rating: 5,
    tags: ["Incubateur", "Masterclass", "Fondateurs", "Stratégie"],
    audience: "Tout fondateur",
    url: "https://www.youtube.com/@ycombinator",
  },
  {
    title: "This Week in Startups",
    author: "Jason Calacanis",
    description: "Interviews hebdomadaires avec des fondateurs, investisseurs et experts. 1700+ épisodes depuis 2009.",
    whyImportant: "L'émission la plus prolifique de l'écosystème startup. Jason pose les questions que personne n'ose poser. Incontournable pour comprendre le VC.",
    language: "🇬🇧 EN",
    rating: 5,
    tags: ["Interviews", "VC", "Tendances", "Actualité"],
    audience: "Fondateurs, investisseurs",
    url: "https://www.youtube.com/@thisweekin",
  },
  {
    title: "Startup Grind",
    author: "Derek Andersen",
    description: "Fireside chats avec les fondateurs les plus influents : Elon Musk, Reid Hoffman, Drew Houston, etc.",
    whyImportant: "Des conversations intimes et profondes avec les bâtisseurs qui ont changé le monde. Format long qui permet d'aller au fond des sujets.",
    language: "🇬🇧 EN",
    rating: 4,
    tags: ["Interviews", "Fondateurs", "Inspiration", "Global"],
    audience: "Fondateurs en quête d'inspiration",
    url: "https://www.youtube.com/@StartupGrind",
  },
  {
    title: "Lenny Rachitsky",
    author: "Lenny Rachitsky (ex-Airbnb)",
    description: "Product management, growth, et stratégie. L'un des newsletters les plus influents devenu vidéo.",
    whyImportant: "Lenny apporte la rigueur d'Airbnb à chaque sujet. Ses frameworks de growth et product sont utilisés par des milliers de PMs.",
    language: "🇬🇧 EN",
    rating: 5,
    tags: ["Product", "Growth", "Métriques", "Frameworks"],
    audience: "Product Managers, Growth Hackers",
    url: "https://www.youtube.com/@LennyRachitsky",
  },
  {
    title: "The Futur",
    author: "Chris Do",
    description: "Business, branding, design thinking et pricing pour créatifs et entrepreneurs.",
    whyImportant: "Excellent pour comprendre le business du design et la valeur perçue. Chris Do excelle dans l'art du pricing et du positionnement.",
    language: "🇬🇧 EN",
    rating: 4,
    tags: ["Branding", "Design", "Pricing", "Business"],
    audience: "Entrepreneurs créatifs, designers",
    url: "https://www.youtube.com/@thefutur",
  },
  {
    title: "Ali Abdaal",
    author: "Ali Abdaal",
    description: "Productivité, entrepreneuriat et création de contenu. Du médecin au créateur à 5M+ abonnés.",
    whyImportant: "La productivité est le superpouvoir du fondateur solo. Ali partage des systèmes éprouvés avec une approche scientifique.",
    language: "🇬🇧 EN",
    rating: 4,
    tags: ["Productivité", "Solopreneur", "Systèmes", "Création"],
    audience: "Solopreneurs, créateurs",
    url: "https://www.youtube.com/@aliabdaal",
  },
  {
    title: "Slidebean",
    author: "Caya (Jose Cayasso)",
    description: "Analyses de business models de startups célèbres, pitch decks et stratégies de levée de fonds.",
    whyImportant: "Les études de cas de Slidebean sont les plus claires du YouTube startup. Parfait pour comprendre pourquoi certaines startups réussissent et d'autres échouent.",
    language: "🇬🇧 EN",
    rating: 4,
    tags: ["Pitch Deck", "Business Model", "Case Study", "Fundraising"],
    audience: "Fondateurs en levée de fonds",
    url: "https://www.youtube.com/@slidebean",
  },
  {
    title: "Strategyzer",
    author: "Alex Osterwalder",
    description: "Chaîne officielle du créateur du Business Model Canvas. Tutoriels, webinaires et outils stratégiques.",
    whyImportant: "Directement du créateur du BMC. Les explications sont claires et les exemples concrets. Ressource officielle de référence.",
    language: "🇬🇧 EN",
    rating: 4,
    tags: ["BMC", "Value Proposition", "Stratégie", "Outils"],
    audience: "Stratèges, consultants, fondateurs",
    url: "https://www.youtube.com/@strategyzer",
  },
];

const PODCASTS: Resource[] = [
  {
    title: "How I Built This",
    author: "Guy Raz (NPR)",
    description: "Les histoires derrière les plus grandes entreprises : Airbnb, Instagram, Spanx, Patagonia, etc.",
    whyImportant: "Le meilleur storytelling du monde startup. Guy Raz extrait les moments pivots et les décisions cruciales. Inspirant ET éducatif.",
    language: "🇬🇧 EN",
    rating: 5,
    tags: ["Storytelling", "Fondateurs", "Inspiration", "Histoire"],
    audience: "Tout le monde — le podcast startup #1",
    url: "https://www.npr.org/series/490248027/how-i-built-this",
    duration: "30-60 min/épisode",
  },
  {
    title: "Masters of Scale",
    author: "Reid Hoffman (LinkedIn)",
    description: "Comment les entreprises passent de 0 à des millions d'utilisateurs. Avec des invités comme Mark Zuckerberg, Brian Chesky.",
    whyImportant: "Reid Hoffman est l'un des investisseurs les plus respectés de la Silicon Valley. Chaque épisode révèle un principe de scaling contre-intuitif.",
    language: "🇬🇧 EN",
    rating: 5,
    tags: ["Scale", "Growth", "Réseau", "Silicon Valley"],
    audience: "Fondateurs en phase de croissance",
    url: "https://mastersofscale.com",
    duration: "30-45 min/épisode",
  },
  {
    title: "The Tim Ferriss Show",
    author: "Tim Ferriss",
    description: "Interviews approfondies avec des performers de classe mondiale : entrepreneurs, investisseurs, athlètes, auteurs.",
    whyImportant: "Tim déconstruit les routines et les frameworks mentaux des meilleurs. Format long qui permet une profondeur rare.",
    language: "🇬🇧 EN",
    rating: 5,
    tags: ["Performance", "Routines", "Mindset", "Deep Dive"],
    audience: "Entrepreneurs ambitieux",
    url: "https://tim.blog/podcast/",
    duration: "1-3h/épisode",
  },
  {
    title: "Acquired",
    author: "Ben Gilbert & David Rosenthal",
    description: "Deep dives de 3-4h sur les acquisitions et stratégies des plus grandes tech companies : NVIDIA, Costco, LVMH.",
    whyImportant: "Le podcast le plus approfondi qui existe. Chaque épisode est une mini-MBA sur une entreprise. La qualité de recherche est inégalée.",
    language: "🇬🇧 EN",
    rating: 5,
    tags: ["Stratégie", "M&A", "Tech", "Deep Dive"],
    audience: "Stratèges, investisseurs, fondateurs avancés",
    url: "https://www.acquired.fm",
    duration: "2-4h/épisode",
  },
  {
    title: "My First Million",
    author: "Sam Parr & Shaan Puri",
    description: "Brainstorming d'idées de business, tendances et opportunités entrepreneuriales. Énergique et concret.",
    whyImportant: "Le podcast le plus créatif pour trouver des idées. Sam et Shaan génèrent des dizaines d'idées par épisode avec une énergie contagieuse.",
    language: "🇬🇧 EN",
    rating: 4,
    tags: ["Idées", "Opportunités", "Brainstorming", "Tendances"],
    audience: "Entrepreneurs en quête d'idées",
    url: "https://www.mfmpod.com",
    duration: "45-90 min/épisode",
  },
  {
    title: "20 Minute VC",
    author: "Harry Stebbings",
    description: "Interviews avec les plus grands VCs : Sequoia, a16z, Benchmark. Le podcast VC le plus écouté au monde.",
    whyImportant: "Pour comprendre comment pensent les investisseurs. Chaque épisode décode les critères de décision des meilleurs fonds du monde.",
    language: "🇬🇧 EN",
    rating: 4,
    tags: ["VC", "Investissement", "Fundraising", "Tendances"],
    audience: "Fondateurs en levée, investisseurs",
    url: "https://www.thetwentyminutevc.com",
    duration: "20-30 min/épisode",
  },
  {
    title: "Génération Do It Yourself",
    author: "Matthieu Stefani",
    description: "Le podcast francophone #1 de l'entrepreneuriat. Interviews de fondateurs français : BlaBlaCar, Doctolib, ManoMano.",
    whyImportant: "La meilleure ressource francophone. Matthieu obtient des témoignages authentiques des plus grands entrepreneurs français.",
    language: "🇫🇷 FR",
    rating: 5,
    tags: ["Francophone", "Fondateurs", "Inspiration", "France"],
    audience: "Entrepreneurs francophones",
    url: "https://www.yourpodcast.fr/gdiy",
    duration: "60-120 min/épisode",
  },
  {
    title: "La Martingale",
    author: "Matthieu Louvet",
    description: "Finance personnelle et investissement pour entrepreneurs. Comment gérer et investir l'argent de sa startup.",
    whyImportant: "Un fondateur doit comprendre la finance. Ce podcast rend l'investissement accessible avec une approche pédagogique remarquable.",
    language: "🇫🇷 FR",
    rating: 4,
    tags: ["Finance", "Investissement", "Francophone", "Pédagogique"],
    audience: "Fondateurs soucieux de leurs finances",
    duration: "30-45 min/épisode",
  },
];

const categoryConfig = {
  books: { icon: BookOpen, label: "📚 Livres", data: BOOKS, color: "text-amber-600" },
  youtube: { icon: Youtube, label: "🎬 YouTube", data: YOUTUBE_CHANNELS, color: "text-red-500" },
  podcasts: { icon: Headphones, label: "🎧 Podcasts", data: PODCASTS, color: "text-purple-500" },
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
    ))}
  </div>
);

const StartupResources = () => {
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>("books");
  const config = categoryConfig[activeCategory];
  const resources = config.data;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border-primary/20">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Award className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2">Bibliothèque du Fondateur</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
            Les ressources essentielles sélectionnées par des mentors seniors. Classées par ordre d'importance 
            — commencez par le haut de chaque liste.
          </p>
        </CardContent>
      </Card>

      {/* Category tabs */}
      <div className="flex justify-center gap-3 flex-wrap">
        {(Object.entries(categoryConfig) as [ResourceCategory, typeof categoryConfig.books][]).map(([key, cfg]) => (
          <Button
            key={key}
            variant={activeCategory === key ? "default" : "outline"}
            onClick={() => setActiveCategory(key)}
            className="gap-2"
          >
            <cfg.icon className="h-4 w-4" />
            {cfg.label}
            <Badge variant="secondary" className="ml-1 text-xs">{cfg.data.length}</Badge>
          </Button>
        ))}
      </div>

      {/* Resources list */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {resources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`transition-all hover:shadow-md ${index < 3 ? "border-primary/30 bg-primary/[0.02]" : ""}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Rank */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? "bg-amber-500 text-white" :
                        index === 1 ? "bg-gray-400 text-white" :
                        index === 2 ? "bg-amber-700 text-white" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        #{index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Title row */}
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <div>
                            <h4 className="font-bold text-lg leading-tight">{resource.title}</h4>
                            <p className="text-sm text-muted-foreground">{resource.author} {resource.year && `• ${resource.year}`}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <StarRating rating={resource.rating} />
                            {resource.url && (
                              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm mb-2">{resource.description}</p>

                        {/* Why important - mentor voice */}
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 mb-3">
                          <p className="text-xs font-medium text-primary mb-1">💡 Pourquoi c'est essentiel :</p>
                          <p className="text-sm text-foreground/80 italic">{resource.whyImportant}</p>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs gap-1">
                            <Globe className="h-3 w-3" /> {resource.language}
                          </Badge>
                          <Badge variant="outline" className="text-xs gap-1">
                            <Users className="h-3 w-3" /> {resource.audience}
                          </Badge>
                          {resource.duration && (
                            <Badge variant="outline" className="text-xs gap-1">
                              <Clock className="h-3 w-3" /> {resource.duration}
                            </Badge>
                          )}
                          {resource.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default StartupResources;
