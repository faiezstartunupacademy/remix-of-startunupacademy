import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icon
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const governorateCoords: Record<string, [number, number]> = {
  Tunis: [36.8065, 10.1815],
  Ariana: [36.8625, 10.1956],
  "Ben Arous": [36.7533, 10.2282],
  Manouba: [36.8101, 10.0863],
  Nabeul: [36.4513, 10.7357],
  Zaghouan: [36.4029, 10.1429],
  Bizerte: [37.2744, 9.8739],
  "Béja": [36.7256, 9.1817],
  Jendouba: [36.5011, 8.7802],
  "Le Kef": [36.1822, 8.7148],
  Siliana: [36.0849, 9.3708],
  Sousse: [35.8254, 10.636],
  Monastir: [35.7643, 10.8113],
  Mahdia: [35.5047, 11.0622],
  Sfax: [34.7406, 10.7603],
  Kairouan: [35.6712, 10.1005],
  Kasserine: [35.1675, 8.8365],
  "Sidi Bouzid": [34.8888, 9.4847],
  "Gabès": [33.8815, 10.0982],
  "Médenine": [33.354, 10.5055],
  Tataouine: [32.9297, 10.4518],
  Gafsa: [34.425, 8.7842],
  Tozeur: [33.9197, 8.1335],
  "Kébili": [33.7047, 8.9653],
};

const stageColors: Record<string, string> = {
  early: "#10b981",
  growth: "#f59e0b",
  scale: "#8b5cf6",
};

interface Startup {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  sector: string;
  stage: string;
  governorate?: string | null;
  votes_count: number;
  program?: string | null;
}

interface TunisiaMapProps {
  startups: Startup[];
}

const createCustomIcon = (stage: string) => {
  const color = stageColors[stage] || "#6366f1";
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background:${color};width:28px;height:28px;border-radius:9999px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"><div style="width:8px;height:8px;background:white;border-radius:9999px;"></div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const TunisiaMap = ({ startups }: TunisiaMapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const mappedStartups = useMemo(
    () =>
      startups
        .filter((s) => s.governorate && governorateCoords[s.governorate])
        .map((s) => ({
          ...s,
          coords: governorateCoords[s.governorate!],
        })),
    [startups]
  );

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [34.5, 9.5],
      zoom: 6,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = markersLayer;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    mappedStartups.forEach((startup) => {
      const safeName = escapeHtml(startup.name);
      const safeTagline = startup.tagline ? escapeHtml(startup.tagline) : "";
      const safeSector = escapeHtml(startup.sector);
      const safeStage = escapeHtml(startup.stage);
      const safeProgram = startup.program ? escapeHtml(startup.program) : "";
      const safeGov = startup.governorate ? escapeHtml(startup.governorate) : "";

      const popupHtml = `
        <div style="min-width:200px;padding:4px;display:flex;flex-direction:column;gap:6px;">
          <a href="/marketplace/${startup.slug}" style="font-weight:700;font-size:13px;color:hsl(var(--primary));text-decoration:none;">${safeName}</a>
          ${safeTagline ? `<p style="margin:0;font-size:11px;color:hsl(var(--muted-foreground));">${safeTagline}</p>` : ""}
          <div style="display:flex;flex-wrap:wrap;gap:4px;">
            <span style="font-size:10px;padding:2px 6px;border-radius:9999px;background:#f1f5f9;">${safeStage}</span>
            <span style="font-size:10px;padding:2px 6px;border-radius:9999px;background:#eef2ff;">${safeSector}</span>
          </div>
          <div style="display:flex;gap:8px;font-size:11px;color:hsl(var(--muted-foreground));">
            <span>▲ ${startup.votes_count}</span>
            ${safeProgram ? `<span>📋 ${safeProgram}</span>` : ""}
            ${safeGov ? `<span>📍 ${safeGov}</span>` : ""}
          </div>
        </div>
      `;

      L.marker(startup.coords, { icon: createCustomIcon(startup.stage) })
        .bindPopup(popupHtml)
        .addTo(markersLayerRef.current!);
    });

    setTimeout(() => mapInstanceRef.current?.invalidateSize(), 0);
  }, [mappedStartups]);

  return (
    <div className="rounded-2xl overflow-hidden border border-border shadow-lg" style={{ height: 500 }}>
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
};

export default TunisiaMap;
