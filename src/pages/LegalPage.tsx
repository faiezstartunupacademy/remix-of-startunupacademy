import { useMemo, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Languages } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import TrustBadge from "@/components/legal/TrustBadge";

type Slug = "terms" | "privacy" | "cookies";

const CONTENT: Record<Slug, { fr: { title: string; body: string }; ar: { title: string; body: string } }> = {
  terms: {
    fr: {
      title: "Conditions Générales d'Utilisation",
      body: `## 1. Objet
Les présentes Conditions Générales d'Utilisation (« CGU ») régissent l'accès et l'utilisation de la plateforme **StarTunUp Academy** (ci-après « la Plateforme »), éditée en Tunisie.

## 2. Acceptation
L'utilisation de la Plateforme implique l'acceptation pleine et entière des présentes CGU. L'utilisateur déclare avoir au moins 16 ans.

## 3. Compte utilisateur
La création d'un compte nécessite une adresse email valide. L'utilisateur s'engage à fournir des informations exactes et à maintenir la confidentialité de ses identifiants.

## 4. Propriété intellectuelle
Tous les contenus (formations, vidéos, textes, logos) sont la propriété de StarTunUp Academy ou de leurs auteurs respectifs. Toute reproduction non autorisée est interdite.

## 5. Données personnelles
Le traitement des données personnelles est régi par notre Politique de confidentialité, conforme à la **loi tunisienne n°2004-63** relative à la protection des données à caractère personnel et au **Règlement Général sur la Protection des Données (RGPD)**.

## 6. Responsabilités
La Plateforme s'efforce d'assurer un service continu et de qualité, sans garantir l'absence d'interruption ou d'erreur. La responsabilité de l'éditeur ne peut être engagée pour les dommages indirects.

## 7. Modification des CGU
Les CGU peuvent être modifiées à tout moment. Les utilisateurs seront informés des modifications substantielles.

## 8. Droit applicable
Les présentes CGU sont régies par le droit tunisien. Tout litige relève de la compétence des tribunaux de Tunis.

---
*Version 1.0 — En attente de validation juridique.*`,
    },
    ar: {
      title: "الشروط العامة للاستخدام",
      body: `## 1. الموضوع
تحكم هذه الشروط العامة للاستخدام الوصول إلى منصة **StarTunUp Academy** واستخدامها، الصادرة في تونس.

## 2. القبول
استخدام المنصة يعني القبول الكامل لهذه الشروط. يصرح المستخدم بأنه يبلغ من العمر 16 عامًا على الأقل.

## 3. حساب المستخدم
يتطلب إنشاء حساب عنوان بريد إلكتروني صالح. يلتزم المستخدم بتقديم معلومات دقيقة والحفاظ على سرية بيانات الاعتماد.

## 4. الملكية الفكرية
جميع المحتويات (الدورات والفيديوهات والنصوص والشعارات) هي ملك لـ StarTunUp Academy أو لمؤلفيها. أي استنساخ غير مصرح به محظور.

## 5. البيانات الشخصية
تخضع معالجة البيانات الشخصية لسياسة الخصوصية الخاصة بنا، وفقًا **للقانون التونسي رقم 2004-63** المتعلق بحماية البيانات الشخصية و**اللائحة العامة لحماية البيانات (GDPR)**.

## 6. المسؤوليات
تسعى المنصة لضمان خدمة مستمرة وعالية الجودة، دون ضمان عدم الانقطاع.

## 7. تعديل الشروط
يمكن تعديل الشروط في أي وقت. سيتم إبلاغ المستخدمين بالتعديلات الجوهرية.

## 8. القانون المطبق
تخضع هذه الشروط للقانون التونسي. تختص محاكم تونس بالنظر في أي نزاع.

---
*الإصدار 1.0 — في انتظار التحقق القانوني.*`,
    },
  },
  privacy: {
    fr: {
      title: "Politique de Confidentialité",
      body: `## Conformité INPDP & RGPD
StarTunUp Academy traite vos données personnelles conformément à la **loi tunisienne n°2004-63** du 27 juillet 2004 et au **Règlement (UE) 2016/679 (RGPD)**.

## 1. Responsable du traitement
**StarTunUp Academy** — Tunis, Tunisie — Contact : startunupacademy1@gmail.com

## 2. Données collectées
- **Identité** : nom, prénom, email
- **Compte** : mot de passe (chiffré), historique de connexion
- **Activité** : formations suivies, scores, projets d'incubation
- **Techniques** : adresse IP, navigateur, cookies

## 3. Finalités du traitement
- Fournir l'accès aux formations et outils
- Personnaliser l'expérience utilisateur
- Assurer la sécurité de la plateforme
- Respecter les obligations légales

## 4. Base légale (RGPD art. 6)
- **Exécution du contrat** pour la fourniture du service
- **Consentement** pour les cookies non essentiels et le marketing
- **Obligation légale** pour les obligations comptables et fiscales
- **Intérêt légitime** pour la sécurité et la prévention de la fraude

## 5. Durées de conservation
- Compte actif : pendant toute la durée d'utilisation
- Compte inactif : 3 ans après la dernière connexion
- Journaux de connexion : 12 mois
- Cookies : 13 mois maximum

## 6. Vos droits (INPDP art. 32-37 / RGPD art. 15-22)
Vous disposez des droits suivants :
- **Accès** à vos données
- **Rectification** des données inexactes
- **Effacement** (« droit à l'oubli »)
- **Limitation** du traitement
- **Portabilité** (téléchargement au format JSON)
- **Opposition** au traitement
- **Retrait du consentement** à tout moment

Exercez vos droits depuis la section « Mes données » de votre profil ou par email.

## 7. Destinataires
Vos données ne sont jamais vendues. Elles sont traitées par notre équipe et nos sous-traitants techniques (hébergement Lovable Cloud / Supabase, conformes RGPD).

## 8. Transferts hors UE / Tunisie
L'hébergement peut impliquer des transferts encadrés par les clauses contractuelles types de la Commission européenne.

## 9. Sécurité
Chiffrement TLS, mots de passe hashés (bcrypt), authentification à deux facteurs disponible, RLS sur toutes les tables sensibles.

## 10. Réclamation
Vous pouvez introduire une réclamation auprès de l'**Instance Nationale de Protection des Données Personnelles (INPDP)** — www.inpdp.nat.tn

---
*Version 1.0 — En attente de validation juridique.*`,
    },
    ar: {
      title: "سياسة الخصوصية",
      body: `## الامتثال لـ INPDP و GDPR
تعالج StarTunUp Academy بياناتك الشخصية وفقًا **للقانون التونسي رقم 2004-63** الصادر في 27 جويلية 2004 و**اللائحة العامة لحماية البيانات (GDPR)**.

## 1. المسؤول عن المعالجة
**StarTunUp Academy** — تونس — اتصال: startunupacademy1@gmail.com

## 2. البيانات المجمعة
- **الهوية**: الاسم، البريد الإلكتروني
- **الحساب**: كلمة المرور (مشفرة)، سجل الاتصال
- **النشاط**: الدورات المتبعة، النتائج
- **تقنية**: عنوان IP، المتصفح، ملفات تعريف الارتباط

## 3. الأغراض
- توفير الوصول إلى الدورات
- تخصيص التجربة
- ضمان الأمن
- احترام الالتزامات القانونية

## 4. حقوقك (المواد 32-37 من INPDP)
- **الوصول** إلى بياناتك
- **التصحيح**
- **الحذف**
- **النقل** (تنزيل JSON)
- **الاعتراض**
- **سحب الموافقة** في أي وقت

مارس حقوقك من قسم "بياناتي" في ملفك الشخصي.

## 5. مدة الاحتفاظ
- حساب نشط: طوال مدة الاستخدام
- حساب غير نشط: 3 سنوات
- سجلات الاتصال: 12 شهرًا

## 6. الأمن
تشفير TLS، كلمات مرور مشفرة، مصادقة ثنائية متاحة.

## 7. الشكوى
يمكنك تقديم شكوى إلى **الهيئة الوطنية لحماية المعطيات الشخصية (INPDP)** — www.inpdp.nat.tn

---
*الإصدار 1.0 — في انتظار التحقق القانوني.*`,
    },
  },
  cookies: {
    fr: {
      title: "Politique de Cookies",
      body: `## Qu'est-ce qu'un cookie ?
Un cookie est un petit fichier déposé sur votre appareil lors de votre visite. Il permet de mémoriser des informations utiles.

## Catégories utilisées
### 🔒 Cookies essentiels (toujours actifs)
- Session d'authentification
- Préférences de langue
- Sécurité (anti-CSRF)
**Durée : session ou 12 mois max.**

### 📊 Cookies analytiques (optionnels)
- Mesure d'audience anonymisée
- Détection des bugs
**Durée : 13 mois max.**

### 🎯 Cookies marketing (optionnels)
- Personnalisation des contenus
- Suivi des campagnes
**Durée : 13 mois max.**

## Gérer vos préférences
Vous pouvez à tout moment modifier vos choix via le bouton « Préférences de cookies » en bas de page, ou via la section « Mon consentement » de votre profil.

## Base légale
Loi tunisienne n°2004-63, RGPD art. 7, directive ePrivacy 2002/58/CE.

---
*Version 1.0*`,
    },
    ar: {
      title: "سياسة ملفات تعريف الارتباط",
      body: `## ما هو ملف تعريف الارتباط؟
ملف تعريف الارتباط هو ملف صغير يتم تخزينه على جهازك عند زيارتك للموقع.

## الفئات المستخدمة
### 🔒 ملفات أساسية (نشطة دائمًا)
- جلسة المصادقة
- تفضيلات اللغة
- الأمان

### 📊 ملفات تحليلية (اختيارية)
- قياس الجمهور المجهول

### 🎯 ملفات تسويقية (اختيارية)
- تخصيص المحتوى

## إدارة تفضيلاتك
يمكنك تعديل اختياراتك في أي وقت عبر زر "تفضيلات ملفات تعريف الارتباط" أو من قسم "موافقتي".

---
*الإصدار 1.0*`,
    },
  },
};

const renderMarkdown = (md: string) => {
  // Minimal markdown rendering (h2, h3, lists, bold, paragraphs)
  return md.split("\n\n").map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-8 text-2xl font-bold text-foreground">
          {block.replace(/^## /, "")}
        </h2>
      );
    }
    if (block.startsWith("### ")) {
      return (
        <h3 key={i} className="mt-6 text-lg font-semibold text-foreground">
          {block.replace(/^### /, "")}
        </h3>
      );
    }
    if (block.startsWith("- ")) {
      return (
        <ul key={i} className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
          {block.split("\n").map((line, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: line.replace(/^- /, "").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
          ))}
        </ul>
      );
    }
    if (block.startsWith("---")) {
      return <hr key={i} className="my-6 border-border" />;
    }
    return (
      <p
        key={i}
        className="text-sm leading-relaxed text-muted-foreground"
        dangerouslySetInnerHTML={{
          __html: block.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>"),
        }}
      />
    );
  });
};

const LegalPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const [locale, setLocale] = useState<"fr" | "ar">(i18n.language === "ar" ? "ar" : "fr");

  if (!slug || !["terms", "privacy", "cookies"].includes(slug)) {
    return <Navigate to="/" replace />;
  }

  const doc = useMemo(() => CONTENT[slug as Slug][locale], [slug, locale]);
  const isAr = locale === "ar";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-12" dir={isAr ? "rtl" : "ltr"}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <TrustBadge variant="compact" />
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <Button size="sm" variant={locale === "fr" ? "default" : "outline"} onClick={() => setLocale("fr")}>
              Français
            </Button>
            <Button size="sm" variant={locale === "ar" ? "default" : "outline"} onClick={() => setLocale("ar")}>
              العربية
            </Button>
          </div>
        </div>

        <Card className="p-6 sm:p-10">
          <h1 className="mb-2 text-3xl font-bold text-foreground">{doc.title}</h1>
          <p className="mb-6 text-xs text-muted-foreground">
            {isAr ? "آخر تحديث" : "Dernière mise à jour"} : {new Date().toLocaleDateString(isAr ? "ar-TN" : "fr-FR")}
          </p>
          <div className="space-y-3">{renderMarkdown(doc.body)}</div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default LegalPage;
