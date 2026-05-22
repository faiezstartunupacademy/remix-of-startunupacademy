export type Governorate = {
  name: string;
  nameAr: string;
  cx: number; // 0-100
  cy: number; // 0-100
  region: "Grand Tunis" | "Nord-Est" | "Nord-Ouest" | "Centre-Est" | "Centre-Ouest" | "Sud-Est" | "Sud-Ouest";
};

export const TUNISIA_GOVERNORATES: Governorate[] = [
  { name: "Tunis", nameAr: "تونس", cx: 50, cy: 14, region: "Grand Tunis" },
  { name: "Ariana", nameAr: "أريانة", cx: 49, cy: 11, region: "Grand Tunis" },
  { name: "Ben Arous", nameAr: "بن عروس", cx: 51, cy: 17, region: "Grand Tunis" },
  { name: "Manouba", nameAr: "منوبة", cx: 46, cy: 14, region: "Grand Tunis" },
  { name: "Nabeul", nameAr: "نابل", cx: 56, cy: 17, region: "Nord-Est" },
  { name: "Zaghouan", nameAr: "زغوان", cx: 50, cy: 21, region: "Nord-Est" },
  { name: "Bizerte", nameAr: "بنزرت", cx: 45, cy: 8, region: "Nord-Est" },
  { name: "Béja", nameAr: "باجة", cx: 40, cy: 16, region: "Nord-Ouest" },
  { name: "Jendouba", nameAr: "جندوبة", cx: 32, cy: 17, region: "Nord-Ouest" },
  { name: "Kef", nameAr: "الكاف", cx: 32, cy: 25, region: "Nord-Ouest" },
  { name: "Siliana", nameAr: "سليانة", cx: 41, cy: 25, region: "Nord-Ouest" },
  { name: "Sousse", nameAr: "سوسة", cx: 56, cy: 27, region: "Centre-Est" },
  { name: "Monastir", nameAr: "المنستير", cx: 59, cy: 29, region: "Centre-Est" },
  { name: "Mahdia", nameAr: "المهدية", cx: 58, cy: 34, region: "Centre-Est" },
  { name: "Sfax", nameAr: "صفاقس", cx: 60, cy: 43, region: "Centre-Est" },
  { name: "Kairouan", nameAr: "القيروان", cx: 48, cy: 32, region: "Centre-Ouest" },
  { name: "Kasserine", nameAr: "القصرين", cx: 38, cy: 35, region: "Centre-Ouest" },
  { name: "Sidi Bouzid", nameAr: "سيدي بوزيد", cx: 46, cy: 40, region: "Centre-Ouest" },
  { name: "Gabès", nameAr: "قابس", cx: 56, cy: 53, region: "Sud-Est" },
  { name: "Médenine", nameAr: "مدنين", cx: 60, cy: 64, region: "Sud-Est" },
  { name: "Tataouine", nameAr: "تطاوين", cx: 52, cy: 80, region: "Sud-Est" },
  { name: "Gafsa", nameAr: "قفصة", cx: 38, cy: 48, region: "Sud-Ouest" },
  { name: "Tozeur", nameAr: "توزر", cx: 30, cy: 55, region: "Sud-Ouest" },
  { name: "Kébili", nameAr: "قبلي", cx: 38, cy: 60, region: "Sud-Ouest" },
];

export const GOVERNORATE_NAMES = TUNISIA_GOVERNORATES.map((g) => g.name);
