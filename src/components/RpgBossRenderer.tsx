import React from 'react';
import { AbapLevelBoss } from '../data/abapLevels';

interface RpgBossRendererProps {
  levelNumber: number;
  boss: AbapLevelBoss;
  isHit?: boolean;
  isDefeated?: boolean;
  className?: string;
}

export const RpgBossRenderer: React.FC<RpgBossRendererProps> = ({
  levelNumber,
  boss,
  isHit = false,
  isDefeated = false,
  className = '',
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center select-none w-48 h-64 sm:w-56 sm:h-72 ${className}`}>
      {/* Dark Boss Aura */}
      <div className="absolute inset-0 rounded-full bg-red-600/20 blur-2xl animate-pulse pointer-events-none" />

      {/* SVG Boss Sprite */}
      <svg
        viewBox="0 0 200 240"
        className={`w-full h-full drop-shadow-2xl transition-all duration-300 ${
          isDefeated
            ? 'opacity-0 scale-50 rotate-45 translate-y-12'
            : isHit
            ? 'filter brightness-150 saturate-200 translate-x-3 -rotate-6'
            : 'animate-pulse'
        }`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="boss-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="100" cy="225" rx="55" ry="14" fill="#000000" fillOpacity="0.5" />

        {/* BOSS 1: Bug Monolítico (Stone Golem) */}
        {levelNumber === 1 && (
          <g id="boss-monolito">
            {/* Rock body */}
            <path d="M60 110 L140 110 L160 200 L40 200 Z" fill="#475569" stroke="#1e293b" strokeWidth="4" />
            {/* Rock cracks */}
            <path d="M90 125 L115 155 L95 185" stroke="#f87171" strokeWidth="3" fill="none" />
            <path d="M120 135 L145 165" stroke="#f87171" strokeWidth="2.5" fill="none" />
            {/* Rocky fists */}
            <rect x="25" y="130" width="30" height="40" rx="8" fill="#334155" />
            <rect x="145" y="130" width="30" height="40" rx="8" fill="#334155" />
            {/* Head */}
            <rect x="75" y="65" width="50" height="45" rx="6" fill="#334155" stroke="#1e293b" strokeWidth="3" />
            {/* Glowing Red Bug Eyes */}
            <rect x="85" y="80" width="10" height="8" rx="2" fill="#ef4444" />
            <rect x="105" y="80" width="10" height="8" rx="2" fill="#ef4444" />
            {/* Missing semicolon rune on forehead */}
            <text x="96" y="55" fill="#f87171" fontSize="24" fontWeight="bold" fontFamily="monospace">;</text>
          </g>
        )}

        {/* BOSS 2: Leviatã Full Table Scan */}
        {levelNumber === 2 && (
          <g id="boss-leviathan">
            {/* Sea Dragon Coils */}
            <path d="M40 180 Q80 140 120 180 Q160 210 170 160" stroke="#0e7490" strokeWidth="26" strokeLinecap="round" fill="none" />
            <path d="M50 140 Q90 100 130 140" stroke="#155e75" strokeWidth="22" strokeLinecap="round" fill="none" />
            {/* Leviathan Head */}
            <path d="M120 80 Q160 60 175 95 Q145 120 115 105 Z" fill="#0891b2" stroke="#164e63" strokeWidth="3" />
            {/* Fangs */}
            <polygon points="145,95 155,108 140,102" fill="#ffffff" />
            <polygon points="158,95 168,110 152,102" fill="#ffffff" />
            {/* Glowing yellow predator eye */}
            <circle cx="150" cy="82" r="6" fill="#eab308" />
            <circle cx="152" cy="82" r="2.5" fill="#000000" />
            {/* Spikes */}
            <polygon points="110,65 122,50 125,70" fill="#f43f5e" />
            <polygon points="90,75 100,60 104,80" fill="#f43f5e" />
          </g>
        )}

        {/* BOSS 3: Dragão do LOOP Infinito */}
        {levelNumber === 3 && (
          <g id="boss-loop-dragon">
            {/* Dragon Wings */}
            <path d="M100 120 Q50 60 20 80 Q40 130 100 130" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="3" />
            <path d="M100 120 Q150 60 180 80 Q160 130 100 130" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="3" />
            {/* Dragon Body */}
            <ellipse cx="100" cy="150" rx="35" ry="45" fill="#991b1b" />
            {/* Belly Scales */}
            <path d="M85 130 Q100 140 115 130 L112 170 Q100 180 88 170 Z" fill="#f59e0b" />
            {/* Dragon Head */}
            <path d="M80 80 Q100 50 120 80 L115 110 Q100 120 85 110 Z" fill="#dc2626" />
            {/* Horns */}
            <path d="M85 75 Q70 45 60 55" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M115 75 Q130 45 140 55" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Fiery Eyes */}
            <circle cx="92" cy="85" r="5" fill="#fef08a" />
            <circle cx="108" cy="85" r="5" fill="#fef08a" />
            {/* Fire breath / Loop aura */}
            <circle cx="100" cy="115" r="14" stroke="#f97316" strokeWidth="4" strokeDasharray="6 4" className="animate-spin" />
          </g>
        )}

        {/* BOSS 4: Golem das RFCs Rompidas */}
        {levelNumber === 4 && (
          <g id="boss-rfc-golem">
            {/* Metal Golem Torso */}
            <rect x="65" y="110" width="70" height="75" rx="10" fill="#334155" stroke="#0f172a" strokeWidth="4" />
            {/* Broken wires with electricity */}
            <path d="M40 130 Q30 160 50 170" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" fill="none" className="animate-pulse" />
            <path d="M160 130 Q170 160 150 170" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" fill="none" className="animate-pulse" />
            {/* Metallic Shoulders & Arms */}
            <rect x="35" y="110" width="30" height="35" rx="6" fill="#475569" />
            <rect x="135" y="110" width="30" height="35" rx="6" fill="#475569" />
            {/* Golem Head */}
            <rect x="75" y="65" width="50" height="42" rx="6" fill="#1e293b" />
            {/* Red Warning Screen */}
            <rect x="82" y="75" width="36" height="15" rx="3" fill="#dc2626" />
            <text x="86" y="86" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">ERROR</text>
            {/* Sparks */}
            <polygon points="100,50 105,60 95,58" fill="#facc15" />
          </g>
        )}

        {/* BOSS 5: Monarca dos Short Dumps ST22 */}
        {levelNumber === 5 && (
          <g id="boss-st22-king">
            {/* Royal Crimson Robe */}
            <path d="M55 105 Q100 85 145 105 L165 205 Q100 225 35 205 Z" fill="#881337" stroke="#4c0519" strokeWidth="3" />
            {/* ST22 Screen Motif */}
            <rect x="70" y="125" width="60" height="45" rx="4" fill="#1e1b4b" stroke="#f43f5e" strokeWidth="2" />
            <text x="76" y="142" fill="#fb7185" fontSize="8" fontWeight="bold" fontFamily="monospace">ST22</text>
            <text x="76" y="156" fill="#fda4af" fontSize="7" fontFamily="monospace">DUMP!</text>
            {/* Dark Head */}
            <circle cx="100" cy="78" r="30" fill="#0f172a" />
            {/* Glowing Red Eyes of Doom */}
            <circle cx="90" cy="78" r="6" fill="#f43f5e" />
            <circle cx="110" cy="78" r="6" fill="#f43f5e" />
            {/* Sinister Crown */}
            <polygon points="76,60 84,35 94,52 100,32 106,52 116,35 124,60" fill="#e11d48" stroke="#fecdd3" strokeWidth="2" />
          </g>
        )}

        {/* BOSS 6: Quimera do Spool Corrompido */}
        {levelNumber === 6 && (
          <g id="boss-spool-chimera">
            {/* Paper scroll wings */}
            <path d="M90 120 Q40 50 15 90 Q30 150 90 130" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="3" />
            <path d="M110 120 Q160 50 185 90 Q170 150 110 130" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="3" />
            {/* Body tangled in print ribbons */}
            <rect x="70" y="115" width="60" height="70" rx="14" fill="#334155" />
            <path d="M60 130 Q100 150 140 130" stroke="#f59e0b" strokeWidth="6" fill="none" />
            <path d="M60 155 Q100 175 140 155" stroke="#0ea5e9" strokeWidth="6" fill="none" />
            {/* Chimera Head */}
            <circle cx="100" cy="80" r="30" fill="#1e293b" />
            {/* Spool printer teeth */}
            <rect x="85" y="92" width="30" height="10" rx="2" fill="#e2e8f0" />
            <line x1="90" y1="92" x2="90" y2="102" stroke="#0f172a" strokeWidth="2" />
            <line x1="95" y1="92" x2="95" y2="102" stroke="#0f172a" strokeWidth="2" />
            <line x1="100" y1="92" x2="100" y2="102" stroke="#0f172a" strokeWidth="2" />
            <line x1="105" y1="92" x2="105" y2="102" stroke="#0f172a" strokeWidth="2" />
            <line x1="110" y1="92" x2="110" y2="102" stroke="#0f172a" strokeWidth="2" />
            {/* Glowing Eyes */}
            <circle cx="90" cy="78" r="6" fill="#fbbf24" />
            <circle cx="110" cy="78" r="6" fill="#fbbf24" />
          </g>
        )}

        {/* BOSS 7: Lorde Supremo CX_SY_REF_IS_INITIAL */}
        {levelNumber === 7 && (
          <g id="boss-nullpointer-lord">
            {/* Void Cloak with Cosmic Particles */}
            <path d="M50 100 Q100 70 150 100 L175 210 Q100 230 25 210 Z" fill="#180b2b" stroke="#a855f7" strokeWidth="3" />
            {/* Glowing Void Core */}
            <circle cx="100" cy="145" r="28" fill="#000000" stroke="#c084fc" strokeWidth="3" />
            <circle cx="100" cy="145" r="16" fill="#581c87" className="animate-ping" />
            {/* Floating Void Runes */}
            <circle cx="60" cy="140" r="8" fill="#7c3aed" className="animate-bounce" />
            <circle cx="140" cy="140" r="8" fill="#7c3aed" className="animate-bounce" />
            {/* Dark Archmage Mask */}
            <polygon points="100,50 125,75 115,105 85,105 75,75" fill="#3b0764" stroke="#e9d5ff" strokeWidth="2" />
            {/* Luminous Purple Gaze */}
            <circle cx="92" cy="80" r="5" fill="#ec4899" />
            <circle cx="108" cy="80" r="5" fill="#ec4899" />
            {/* Cosmic Halo */}
            <ellipse cx="100" cy="50" rx="35" ry="10" stroke="#f472b6" strokeWidth="3" strokeDasharray="8 6" className="animate-spin" />
          </g>
        )}
      </svg>
    </div>
  );
};
