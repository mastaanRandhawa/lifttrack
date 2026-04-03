"use client";

import { cn } from "@/lib/utils";
import type { MuscleActivation, BodyView } from "@/types";

type ActivationLevel = MuscleActivation["level"];

const LEVEL_FILL: Record<ActivationLevel, string> = {
  fresh: "#1e2030",
  light: "rgba(34,197,94,0.55)",
  moderate: "rgba(251,191,36,0.7)",
  heavy: "rgba(239,68,68,0.75)",
  recovering: "rgba(99,102,241,0.65)",
};

const LEVEL_STROKE: Record<ActivationLevel, string> = {
  fresh: "rgba(255,255,255,0.06)",
  light: "rgba(34,197,94,0.8)",
  moderate: "rgba(251,191,36,0.9)",
  heavy: "rgba(239,68,68,0.9)",
  recovering: "rgba(99,102,241,0.9)",
};

interface BodyMapSvgProps {
  view: BodyView;
  activations: MuscleActivation[];
  selectedMuscle: string | null;
  onMuscleClick: (muscleId: string) => void;
}

function getMuscleProps(
  muscleId: string,
  activations: MuscleActivation[],
  selectedMuscle: string | null
) {
  const activation = activations.find((a) => a.muscleId === muscleId);
  const level: ActivationLevel = activation?.level ?? "fresh";
  const isSelected = selectedMuscle === muscleId;
  return {
    fill: LEVEL_FILL[level],
    stroke: isSelected ? "#fff" : LEVEL_STROKE[level],
    strokeWidth: isSelected ? 2 : 0.8,
    opacity: isSelected ? 1 : 0.9,
    style: { cursor: "pointer", transition: "all 0.15s ease" },
  };
}

export function BodyMapSvg({ view, activations, selectedMuscle, onMuscleClick }: BodyMapSvgProps) {
  const mp = (id: string) => ({
    ...getMuscleProps(id, activations, selectedMuscle),
    onClick: () => onMuscleClick(id),
  });

  return (
    <svg
      viewBox="0 0 200 480"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full max-h-[520px]"
      style={{ filter: "drop-shadow(0 0 20px rgba(99,102,241,0.08))" }}
    >
      {/* Body silhouette base */}
      <g fill="#0f1018" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5">
        {/* Head */}
        <ellipse cx="100" cy="34" rx="22" ry="26" />
        {/* Neck */}
        <rect x="91" y="57" width="18" height="14" rx="4" />
        {/* Torso */}
        <path d="M60,70 Q48,80 46,140 L50,240 L150,240 L154,140 Q152,80 140,70 Q120,62 100,62 Q80,62 60,70Z" />
        {/* Upper arms */}
        <path d="M46,80 Q32,90 28,130 Q26,160 32,180 Q38,180 44,170 Q48,155 50,140 Q54,100 60,80Z" />
        <path d="M154,80 Q168,90 172,130 Q174,160 168,180 Q162,180 156,170 Q152,155 150,140 Q146,100 140,80Z" />
        {/* Forearms */}
        <path d="M32,180 Q24,210 22,240 Q24,255 32,255 Q40,245 44,230 Q44,200 44,185Z" />
        <path d="M168,180 Q176,210 178,240 Q176,255 168,255 Q160,245 156,230 Q156,200 156,185Z" />
        {/* Hips */}
        <path d="M50,240 L150,240 Q160,250 158,270 L42,270 Q40,250 50,240Z" />
        {/* Upper legs */}
        <path d="M52,270 Q44,310 44,360 Q46,380 58,385 Q70,380 72,360 Q74,310 74,270Z" />
        <path d="M148,270 Q156,310 156,360 Q154,380 142,385 Q130,380 128,360 Q126,310 126,270Z" />
        {/* Lower legs */}
        <path d="M44,385 Q38,420 38,450 Q42,465 54,465 Q66,460 66,450 Q64,420 58,385Z" />
        <path d="M156,385 Q162,420 162,450 Q158,465 146,465 Q134,460 134,450 Q136,420 142,385Z" />
        {/* Feet */}
        <path d="M38,462 Q30,470 32,475 Q42,478 60,475 Q66,468 54,462Z" />
        <path d="M162,462 Q170,470 168,475 Q158,478 140,475 Q134,468 146,462Z" />
      </g>

      {view === "front" ? (
        <FrontMuscles mp={mp} />
      ) : (
        <BackMuscles mp={mp} />
      )}
    </svg>
  );
}

function FrontMuscles({ mp }: { mp: (id: string) => object }) {
  return (
    <g>
      {/* Chest (pectorals) */}
      <path
        d="M65,75 Q58,88 60,105 Q72,112 90,110 Q100,108 100,95 Q100,80 90,74 Q78,70 65,75Z"
        {...(mp("chest") as React.SVGProps<SVGPathElement>)}
      />
      <path
        d="M135,75 Q142,88 140,105 Q128,112 110,110 Q100,108 100,95 Q100,80 110,74 Q122,70 135,75Z"
        {...(mp("chest") as React.SVGProps<SVGPathElement>)}
      />

      {/* Front delts */}
      <ellipse cx="54" cy="80" rx="10" ry="13" {...(mp("front-delts") as React.SVGProps<SVGEllipseElement>)} />
      <ellipse cx="146" cy="80" rx="10" ry="13" {...(mp("front-delts") as React.SVGProps<SVGEllipseElement>)} />

      {/* Biceps */}
      <path
        d="M32,105 Q24,125 26,150 Q34,155 42,145 Q48,130 48,105 Q42,100 32,105Z"
        {...(mp("biceps") as React.SVGProps<SVGPathElement>)}
      />
      <path
        d="M168,105 Q176,125 174,150 Q166,155 158,145 Q152,130 152,105 Q158,100 168,105Z"
        {...(mp("biceps") as React.SVGProps<SVGPathElement>)}
      />

      {/* Forearms front */}
      <path
        d="M26,155 Q20,185 22,215 Q30,220 38,210 Q42,190 42,160 Q36,152 26,155Z"
        {...(mp("forearms") as React.SVGProps<SVGPathElement>)}
      />
      <path
        d="M174,155 Q180,185 178,215 Q170,220 162,210 Q158,190 158,160 Q164,152 174,155Z"
        {...(mp("forearms") as React.SVGProps<SVGPathElement>)}
      />

      {/* Abs */}
      <rect x="85" y="115" width="14" height="12" rx="3" {...(mp("abs") as React.SVGProps<SVGRectElement>)} />
      <rect x="101" y="115" width="14" height="12" rx="3" {...(mp("abs") as React.SVGProps<SVGRectElement>)} />
      <rect x="85" y="130" width="14" height="12" rx="3" {...(mp("abs") as React.SVGProps<SVGRectElement>)} />
      <rect x="101" y="130" width="14" height="12" rx="3" {...(mp("abs") as React.SVGProps<SVGRectElement>)} />
      <rect x="85" y="145" width="14" height="12" rx="3" {...(mp("abs") as React.SVGProps<SVGRectElement>)} />
      <rect x="101" y="145" width="14" height="12" rx="3" {...(mp("abs") as React.SVGProps<SVGRectElement>)} />

      {/* Obliques */}
      <path
        d="M62,115 Q55,140 58,165 Q70,170 78,160 Q82,140 82,115 Q74,110 62,115Z"
        {...(mp("obliques") as React.SVGProps<SVGPathElement>)}
      />
      <path
        d="M138,115 Q145,140 142,165 Q130,170 122,160 Q118,140 118,115 Q126,110 138,115Z"
        {...(mp("obliques") as React.SVGProps<SVGPathElement>)}
      />

      {/* Quads */}
      <path
        d="M53,272 Q45,320 46,360 Q54,372 66,368 Q76,355 76,320 Q76,280 72,270Z"
        {...(mp("quads") as React.SVGProps<SVGPathElement>)}
      />
      <path
        d="M147,272 Q155,320 154,360 Q146,372 134,368 Q124,355 124,320 Q124,280 128,270Z"
        {...(mp("quads") as React.SVGProps<SVGPathElement>)}
      />

      {/* Calves front (tibialis) */}
      <path
        d="M46,390 Q40,420 40,448 Q48,456 56,452 Q62,432 62,400 Q58,388 46,390Z"
        {...(mp("calves") as React.SVGProps<SVGPathElement>)}
      />
      <path
        d="M154,390 Q160,420 160,448 Q152,456 144,452 Q138,432 138,400 Q142,388 154,390Z"
        {...(mp("calves") as React.SVGProps<SVGPathElement>)}
      />

      {/* Traps upper */}
      <path
        d="M78,62 Q72,72 76,82 Q86,88 100,88 Q114,88 124,82 Q128,72 122,62 Q112,56 100,56 Q88,56 78,62Z"
        {...(mp("traps") as React.SVGProps<SVGPathElement>)}
      />
    </g>
  );
}

function BackMuscles({ mp }: { mp: (id: string) => object }) {
  return (
    <g>
      {/* Traps */}
      <path
        d="M68,65 Q58,80 62,100 Q75,110 100,108 Q125,110 138,100 Q142,80 132,65 Q120,58 100,58 Q80,58 68,65Z"
        {...(mp("traps") as React.SVGProps<SVGPathElement>)}
      />

      {/* Rear delts */}
      <ellipse cx="54" cy="84" rx="10" ry="12" {...(mp("rear-delts") as React.SVGProps<SVGEllipseElement>)} />
      <ellipse cx="146" cy="84" rx="10" ry="12" {...(mp("rear-delts") as React.SVGProps<SVGEllipseElement>)} />

      {/* Lats */}
      <path
        d="M56,95 Q46,120 48,155 Q56,168 72,165 Q84,155 86,130 Q88,105 82,88 Q72,84 56,95Z"
        {...(mp("lats") as React.SVGProps<SVGPathElement>)}
      />
      <path
        d="M144,95 Q154,120 152,155 Q144,168 128,165 Q116,155 114,130 Q112,105 118,88 Q128,84 144,95Z"
        {...(mp("lats") as React.SVGProps<SVGPathElement>)}
      />

      {/* Rhomboids / mid traps */}
      <path
        d="M76,100 Q72,120 76,140 Q88,148 100,148 Q112,148 124,140 Q128,120 124,100 Q112,94 100,94 Q88,94 76,100Z"
        {...(mp("rhomboids") as React.SVGProps<SVGPathElement>)}
      />

      {/* Lower back / erectors */}
      <path
        d="M82,150 Q78,180 80,210 Q90,220 100,220 Q110,220 120,210 Q122,180 118,150 Q112,145 100,145 Q88,145 82,150Z"
        {...(mp("lower-back") as React.SVGProps<SVGPathElement>)}
      />

      {/* Triceps */}
      <path
        d="M34,100 Q26,130 28,165 Q36,170 44,162 Q50,148 50,120 Q50,98 42,94Z"
        {...(mp("triceps") as React.SVGProps<SVGPathElement>)}
      />
      <path
        d="M166,100 Q174,130 172,165 Q164,170 156,162 Q150,148 150,120 Q150,98 158,94Z"
        {...(mp("triceps") as React.SVGProps<SVGPathElement>)}
      />

      {/* Forearms */}
      <path
        d="M28,170 Q20,200 22,230 Q30,235 38,225 Q42,208 42,178 Q36,166 28,170Z"
        {...(mp("forearms") as React.SVGProps<SVGPathElement>)}
      />
      <path
        d="M172,170 Q180,200 178,230 Q170,235 162,225 Q158,208 158,178 Q164,166 172,170Z"
        {...(mp("forearms") as React.SVGProps<SVGPathElement>)}
      />

      {/* Glutes */}
      <path
        d="M50,245 Q42,270 44,290 Q56,300 78,296 Q88,285 88,265 Q84,248 72,242Z"
        {...(mp("glutes") as React.SVGProps<SVGPathElement>)}
      />
      <path
        d="M150,245 Q158,270 156,290 Q144,300 122,296 Q112,285 112,265 Q116,248 128,242Z"
        {...(mp("glutes") as React.SVGProps<SVGPathElement>)}
      />

      {/* Hamstrings */}
      <path
        d="M50,298 Q44,335 46,368 Q56,376 68,372 Q76,360 76,330 Q76,298 72,292Z"
        {...(mp("hamstrings") as React.SVGProps<SVGPathElement>)}
      />
      <path
        d="M150,298 Q156,335 154,368 Q144,376 132,372 Q124,360 124,330 Q124,298 128,292Z"
        {...(mp("hamstrings") as React.SVGProps<SVGPathElement>)}
      />

      {/* Calves */}
      <path
        d="M46,378 Q38,415 40,448 Q50,458 60,452 Q66,435 66,402 Q60,380 46,378Z"
        {...(mp("calves") as React.SVGProps<SVGPathElement>)}
      />
      <path
        d="M154,378 Q162,415 160,448 Q150,458 140,452 Q134,435 134,402 Q140,380 154,378Z"
        {...(mp("calves") as React.SVGProps<SVGPathElement>)}
      />
    </g>
  );
}
