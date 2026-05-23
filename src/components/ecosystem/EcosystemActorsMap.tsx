import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export const ACTOR_CATEGORY_COLORS: Record<string, string> = {
  "Incubateurs": "#6366f1",
  "Accélérateurs": "#f59e0b",
  "Venture Builders": "#8b5cf6",
  "FabLabs": "#ef4444",
  "Espaces de Coworking": "#10b981",
  "Organismes Publics": "#0ea5e9",
  "Programmes d'Appui": "#ec4899",
};

export interface EcosystemActor {
  id: string;
  name: string;
  slug: string;
  partner_type: string;
  description?: string | null;
  governorate?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  logo_url?: string | null;
  website?: string | null;
  is_verified?: boolean | null;
  programs_offered?: string[] | null;
}

interface Props {
  actors: EcosystemActor[];
  onSelect: (actor: EcosystemActor) => void;
}

const escapeHtml = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

const buildIcon = (type: string) => {
  const color = ACTOR_CATEGORY_COLORS[type] || "#6366f1";
  return L.divIcon({
    className: "ecosystem-actor-marker",
    html: `<div style="background:${color};width:28px;height:28px;border-radius:9999px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;"><div style="width:8px;height:8px;background:white;border-radius:9999px;"></div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
};

export default function EcosystemActorsMap({ actors, onSelect }: Props) {
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  const points = useMemo(
    () =>
      actors
        .map((a) => ({
          ...a,
          lat: a.latitude ? Number(a.latitude) : null,
          lng: a.longitude ? Number(a.longitude) : null,
        }))
        .filter((a) => a.lat !== null && a.lng !== null && !Number.isNaN(a.lat) && !Number.isNaN(a.lng)),
    [actors]
  );

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    const m = L.map(mapEl.current, { center: [34.5, 9.5], zoom: 6, scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(m);
    layerRef.current = L.layerGroup().addTo(m);
    mapRef.current = m;
    return () => {
      m.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !layerRef.current) return;
    layerRef.current.clearLayers();

    points.forEach((a) => {
      const popupHtml = `
        <div style="min-width:200px;display:flex;flex-direction:column;gap:6px;">
          <div style="font-weight:700;font-size:13px;">${escapeHtml(a.name)}</div>
          <span style="display:inline-block;width:fit-content;font-size:10px;padding:2px 8px;border-radius:9999px;background:${ACTOR_CATEGORY_COLORS[a.partner_type] || "#6366f1"};color:white;">${escapeHtml(a.partner_type)}</span>
          ${a.governorate ? `<div style="font-size:11px;color:#64748b;">📍 ${escapeHtml(a.governorate)}</div>` : ""}
          <button data-actor-id="${a.id}" class="ecosystem-actor-open" style="margin-top:4px;font-size:12px;font-weight:600;color:#fff;background:hsl(var(--primary));padding:6px 10px;border-radius:6px;border:none;cursor:pointer;">Voir la fiche</button>
        </div>`;
      const marker = L.marker([a.lat as number, a.lng as number], { icon: buildIcon(a.partner_type) })
        .bindPopup(popupHtml)
        .addTo(layerRef.current!);
      marker.on("popupopen", (e) => {
        const node = (e.popup.getElement() as HTMLElement)?.querySelector<HTMLButtonElement>("button.ecosystem-actor-open");
        if (node) node.onclick = () => onSelect(a);
      });
    });

    setTimeout(() => mapRef.current?.invalidateSize(), 0);
  }, [points, onSelect]);

  return (
    <div className="rounded-2xl overflow-hidden border border-border shadow-md" style={{ height: 500 }}>
      <div ref={mapEl} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}
