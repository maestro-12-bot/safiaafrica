import { Maximize2, Upload, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  COLOR_TREATMENTS,
  FINISH_OPTIONS,
  FRAME_OPTIONS,
  MATERIAL_OPTIONS,
  ORIENTATION_RATIO,
  findSizeTier,
  type SizeCode,
} from "@/data/catalog";

export interface PreviewConfig {
  image: string;
  name: string;
  sizeCode: SizeCode;
  frameId: string;
  materialId: string;
  finishId: string;
  color: string;
  orientation: string;
}

export const ROOM_SCENES = [
  {
    id: "gallery",
    label: "Gallery",
    wall: "linear-gradient(180deg,#1b1b1e 0%,#121214 100%)",
    floor: "linear-gradient(180deg,#26262a,#121214)",
    light: "radial-gradient(ellipse at 50% 0%, rgba(255,238,200,0.22), transparent 65%)",
  },
  {
    id: "living",
    label: "Living room",
    wall: "linear-gradient(180deg,#3a3128 0%,#241e18 100%)",
    floor: "linear-gradient(180deg,#4a3a2a,#241c14)",
    light: "radial-gradient(ellipse at 70% 5%, rgba(255,206,140,0.24), transparent 60%)",
  },
  {
    id: "bedroom",
    label: "Bedroom",
    wall: "linear-gradient(180deg,#2b2733 0%,#1a1820 100%)",
    floor: "linear-gradient(180deg,#332e3c,#1a1820)",
    light: "radial-gradient(ellipse at 30% 10%, rgba(200,190,255,0.18), transparent 60%)",
  },
  {
    id: "office",
    label: "Office",
    wall: "linear-gradient(180deg,#22262b 0%,#14171a 100%)",
    floor: "linear-gradient(180deg,#2c3138,#14171a)",
    light: "radial-gradient(ellipse at 50% 0%, rgba(190,220,255,0.16), transparent 60%)",
  },
  {
    id: "hotel",
    label: "Hotel lobby",
    wall: "linear-gradient(180deg,#332a20 0%,#1d1812 100%)",
    floor: "linear-gradient(180deg,#5a4630,#241c13)",
    light: "radial-gradient(ellipse at 50% 0%, rgba(255,214,150,0.26), transparent 62%)",
  },
  {
    id: "boardroom",
    label: "Boardroom",
    wall: "linear-gradient(180deg,#1d1f24 0%,#101114 100%)",
    floor: "linear-gradient(180deg,#2a2d33,#101114)",
    light: "radial-gradient(ellipse at 50% 0%, rgba(220,230,255,0.14), transparent 58%)",
  },
  {
    id: "presidential",
    label: "Presidential office",
    wall: "linear-gradient(180deg,#2a2213 0%,#161206 100%)",
    floor: "linear-gradient(180deg,#4d3c1c,#191305)",
    light: "radial-gradient(ellipse at 50% 0%, rgba(255,225,150,0.3), transparent 62%)",
  },
] as const;

function Artwork({ config, maxWidth }: { config: PreviewConfig; maxWidth: number }) {
  const frame = FRAME_OPTIONS.find((f) => f.id === config.frameId) ?? FRAME_OPTIONS[0]!;
  const material = MATERIAL_OPTIONS.find((m) => m.id === config.materialId) ?? MATERIAL_OPTIONS[0]!;
  const finish = FINISH_OPTIONS.find((f) => f.id === config.finishId) ?? FINISH_OPTIONS[0]!;
  const tone = COLOR_TREATMENTS[config.color] ?? { hue: 0, overlay: "transparent" };
  const ratio = ORIENTATION_RATIO[config.orientation] ?? 1;
  const scale = findSizeTier(config.sizeCode)?.scale ?? 0.6;

  const width = Math.round(maxWidth * scale);
  const height = Math.round(width / ratio);
  const frameWidth = Math.max(0, Math.round(frame.width * (0.55 + scale * 0.6)));

  return (
    <figure
      className="relative transition-all duration-700 ease-out"
      style={{
        width,
        height,
        background: frame.frameCss,
        padding: frameWidth,
        borderRadius: frameWidth ? 4 : 2,
        boxShadow: `0 ${18 + scale * 30}px ${34 + scale * 46}px rgba(0,0,0,${0.45 + material.relief * 0.2}), 0 2px 6px rgba(0,0,0,0.5)`,
      }}
      aria-label={`Preview of ${config.name}`}
    >
      <div
        className="relative h-full w-full overflow-hidden"
        style={{ boxShadow: frameWidth ? `inset 0 0 0 2px ${frame.lip}` : undefined }}
      >
        <img
          src={config.image}
          alt={`${config.name} configured preview`}
          className="h-full w-full object-cover transition-all duration-700"
          style={{
            filter: `saturate(${finish.saturate}) contrast(${finish.contrast}) hue-rotate(${tone.hue}deg) brightness(${0.94 + finish.gloss * 0.12})`,
          }}
        />
        {/* colourway wash */}
        <span
          className="pointer-events-none absolute inset-0 transition-colors duration-700"
          style={{ background: tone.overlay, mixBlendMode: "color" }}
        />
        {/* material texture */}
        <span
          className="pointer-events-none absolute inset-0 transition-opacity duration-700"
          style={{
            backgroundImage: material.textureCss,
            opacity: material.textureOpacity,
            mixBlendMode: material.blend as React.CSSProperties["mixBlendMode"],
          }}
        />
        {/* relief depth */}
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            boxShadow: `inset 0 0 ${20 + material.relief * 60}px rgba(0,0,0,${0.2 + material.relief * 0.35})`,
          }}
        />
        {/* finish specular sweep */}
        <span
          className="pointer-events-none absolute inset-0 transition-opacity duration-700"
          style={{
            background:
              "linear-gradient(115deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 32%, rgba(255,255,255,0.5) 52%, rgba(255,255,255,0) 78%)",
            opacity: finish.gloss * 0.5,
            mixBlendMode: "screen",
          }}
        />
      </div>
    </figure>
  );
}

export function MasterpiecePreview({ config }: { config: PreviewConfig }) {
  const [sceneId, setSceneId] = useState<string>(ROOM_SCENES[0]!.id);
  const [roomPhoto, setRoomPhoto] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const scene = ROOM_SCENES.find((s) => s.id === sceneId) ?? ROOM_SCENES[0]!;
  const tier = findSizeTier(config.sizeCode);

  useEffect(() => {
    return () => {
      if (roomPhoto) URL.revokeObjectURL(roomPhoto);
    };
  }, [roomPhoto]);

  const stage = useMemo(
    () => (
      <div
        className="relative overflow-hidden rounded-lg border border-border"
        style={{ aspectRatio: "4 / 3" }}
      >
        {roomPhoto ? (
          <img src={roomPhoto} alt="Your room" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <>
            <span className="absolute inset-0" style={{ background: scene.wall }} />
            <span className="absolute inset-x-0 bottom-0 h-[22%]" style={{ background: scene.floor }} />
          </>
        )}
        <span className="pointer-events-none absolute inset-0" style={{ background: scene.light }} />
        <div className="absolute inset-0 flex items-center justify-center pb-[10%]">
          <div className="w-[86%]">
            <div className="flex justify-center">
              <StageArtwork config={config} />
            </div>
          </div>
        </div>
        <p className="absolute bottom-2 left-3 text-[10px] tracking-luxe text-white/70">
          {roomPhoto ? "Your space" : scene.label} · {config.sizeCode === "CUSTOM" ? "Custom" : config.sizeCode}
          {tier ? ` · ${tier.dimensions}` : ""}
        </p>
        <button
          type="button"
          onClick={() => setFullscreen(true)}
          aria-label="Open fullscreen preview"
          className="absolute right-2 top-2 rounded-full bg-black/50 p-2 text-white/80 backdrop-blur hover:text-white"
        >
          <Maximize2 className="size-3.5" />
        </button>
      </div>
    ),
    [config, roomPhoto, scene, tier],
  );

  return (
    <div className="space-y-3">
      <p className="text-[10px] tracking-luxe text-gold">See your masterpiece</p>
      {stage}

      <div className="flex flex-wrap gap-1.5">
        {ROOM_SCENES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setSceneId(s.id);
              setRoomPhoto(null);
            }}
            className={`rounded-full border px-3 py-1 text-[10px] tracking-luxe transition-colors ${
              !roomPhoto && sceneId === s.id
                ? "border-gold text-gold"
                : "border-border text-muted-foreground hover:border-gold/50"
            }`}
          >
            {s.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] tracking-luxe transition-colors ${
            roomPhoto ? "border-gold text-gold" : "border-border text-muted-foreground hover:border-gold/50"
          }`}
        >
          <Upload className="size-3" /> View in my space
        </button>
        {roomPhoto && (
          <button
            type="button"
            onClick={() => setRoomPhoto(null)}
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-[10px] tracking-luxe text-muted-foreground"
          >
            <X className="size-3" /> Clear
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (!file.type.startsWith("image/")) return;
            if (file.size > 12 * 1024 * 1024) return;
            setRoomPhoto(URL.createObjectURL(file));
          }}
        />
      </div>

      {fullscreen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            aria-label="Close fullscreen preview"
            className="absolute right-4 top-4 rounded-full border border-border p-2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
          <div className="max-h-full w-full max-w-4xl">
            <div className="relative overflow-hidden rounded-lg border border-border" style={{ aspectRatio: "16 / 9" }}>
              {roomPhoto ? (
                <img src={roomPhoto} alt="Your room" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <>
                  <span className="absolute inset-0" style={{ background: scene.wall }} />
                  <span className="absolute inset-x-0 bottom-0 h-[20%]" style={{ background: scene.floor }} />
                </>
              )}
              <span className="pointer-events-none absolute inset-0" style={{ background: scene.light }} />
              <div className="absolute inset-0 flex items-center justify-center pb-[8%]">
                <Artwork config={config} maxWidth={520} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StageArtwork({ config }: { config: PreviewConfig }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(320);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth || 320);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex w-full justify-center">
      <Artwork config={config} maxWidth={width} />
    </div>
  );
}
