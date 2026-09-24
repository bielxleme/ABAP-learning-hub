import React from 'react';
import { RpgRace } from '../types';
import { RPG_RACES } from '../data/rpgAvatars';

interface RpgAvatarRendererProps {
  race: RpgRace;
  level?: number;
  pose?: 'idle' | 'attack' | 'cast' | 'victory' | 'hurt';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showWeaponGlow?: boolean;
  className?: string;
}

export const RpgAvatarRenderer: React.FC<RpgAvatarRendererProps> = ({
  race = 'mago',
  level = 1,
  pose = 'idle',
  size = 'md',
  showWeaponGlow = true,
  className = '',
}) => {
  const meta = RPG_RACES[race] || RPG_RACES.mago;

  // Size mapping
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
    full: 'w-48 h-64 sm:w-56 sm:h-72',
  }[size];

  // Pose transform animations
  const poseClasses = {
    idle: 'animate-bounce duration-1000',
    attack: 'scale-110 translate-x-4 rotate-3 transition-transform duration-200',
    cast: 'scale-105 -translate-y-2 transition-transform duration-200',
    victory: 'scale-115 -translate-y-4 transition-transform duration-300',
    hurt: 'rotate-12 translate-x-2 filter grayscale-50 transition-all duration-200',
  }[pose];

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${sizeClasses} ${className}`}>
      {/* Glow Aura for High Levels */}
      {level >= 3 && (
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-40 animate-pulse pointer-events-none"
          style={{ backgroundColor: meta.accentColor }}
        />
      )}

      {/* SVG Character Model - Cute 2D RPG Art Style */}
      <svg
        viewBox="0 0 200 240"
        className={`w-full h-full drop-shadow-lg transition-all ${poseClasses}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={`glow-${race}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={meta.accentColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={meta.themeColor} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`cape-${race}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={meta.themeColor} />
            <stop offset="100%" stopColor="#0b132b" />
          </linearGradient>
          <linearGradient id="gold-crown" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Shadow underneath */}
        <ellipse cx="100" cy="225" rx="45" ry="12" fill="#000000" fillOpacity="0.35" />

        {/* RACE SPECIFIC DRAWINGS */}
        {race === 'orc' && (
          <g id="orc-character">
            {/* Cape / Leather mantle */}
            <path d="M60 110 Q100 85 140 110 L155 190 Q100 210 45 190 Z" fill="#3f2e1e" />
            {/* Body / Heavy Chest */}
            <rect x="65" y="115" width="70" height="70" rx="18" fill="#15803d" />
            <rect x="75" y="125" width="50" height="45" rx="8" fill="#166534" />
            {/* Iron Belt with SAP Rune */}
            <rect x="60" y="175" width="80" height="15" rx="4" fill="#374151" />
            <circle cx="100" cy="182" r="8" fill="#f59e0b" />
            {/* Legs */}
            <rect x="70" y="188" width="22" height="32" rx="7" fill="#1e293b" />
            <rect x="108" y="188" width="22" height="32" rx="7" fill="#1e293b" />
            {/* Big Boots */}
            <ellipse cx="80" cy="220" rx="14" ry="7" fill="#111827" />
            <ellipse cx="120" cy="220" rx="14" ry="7" fill="#111827" />
            {/* Arms */}
            <rect x="42" y="125" width="24" height="45" rx="10" fill="#22c55e" transform="rotate(10 42 125)" />
            <rect x="134" y="125" width="24" height="45" rx="10" fill="#22c55e" transform="rotate(-15 134 125)" />
            {/* Weapon: Massive War Hammer / Axe */}
            <g transform={pose === 'attack' ? 'rotate(-25 150 110)' : 'rotate(10 150 110)'}>
              <rect x="150" y="60" width="8" height="110" rx="4" fill="#78350f" />
              <rect x="135" y="50" width="38" height="28" rx="6" fill="#64748b" stroke="#334155" strokeWidth="2" />
              <circle cx="154" cy="64" r="5" fill="#38bdf8" />
            </g>
            {/* Cute Orc Head */}
            <circle cx="100" cy="80" r="36" fill="#22c55e" />
            {/* Pointy cute ears with earrings */}
            <polygon points="58,75 35,65 60,90" fill="#16a34a" />
            <circle cx="43" cy="74" r="3" fill="#f59e0b" />
            <polygon points="142,75 165,65 140,90" fill="#16a34a" />
            <circle cx="157" cy="74" r="3" fill="#f59e0b" />
            {/* Cute Big Eyes */}
            <circle cx="85" cy="78" r="8" fill="#ffffff" />
            <circle cx="87" cy="78" r="4.5" fill="#0f172a" />
            <circle cx="89" cy="75" r="2" fill="#ffffff" />
            <circle cx="115" cy="78" r="8" fill="#ffffff" />
            <circle cx="117" cy="78" r="4.5" fill="#0f172a" />
            <circle cx="119" cy="75" r="2" fill="#ffffff" />
            {/* Cute mini tusks */}
            <polygon points="86,95 91,85 96,95" fill="#ffffff" />
            <polygon points="104,95 109,85 114,95" fill="#ffffff" />
            {/* Helmet / Horns */}
            <path d="M68 65 Q100 40 132 65 L130 52 Q100 35 70 52 Z" fill="#475569" />
            <polygon points="68,55 50,30 75,45" fill="#d97706" />
            <polygon points="132,55 150,30 125,45" fill="#d97706" />
          </g>
        )}

        {race === 'mago' && (
          <g id="mago-character">
            {/* Flowing Arcane Robe */}
            <path d="M60 105 Q100 90 140 105 L158 205 Q100 220 42 205 Z" fill={`url(#cape-${race})`} />
            {/* Robe embroidery and belt */}
            <rect x="70" y="170" width="60" height="10" rx="3" fill="#fbbf24" />
            <circle cx="100" cy="175" r="5" fill="#c084fc" />
            {/* Feet poking out */}
            <ellipse cx="85" cy="215" rx="10" ry="5" fill="#475569" />
            <ellipse cx="115" cy="215" rx="10" ry="5" fill="#475569" />
            {/* Left Hand */}
            <circle cx="65" cy="145" r="9" fill="#fed7aa" />
            {/* Right Hand holding Arcane Staff */}
            <circle cx="138" cy="140" r="9" fill="#fed7aa" />
            {/* Arcane Crystal Staff */}
            <g transform={pose === 'cast' ? 'rotate(-15 140 130)' : 'rotate(5 140 130)'}>
              <line x1="140" y1="40" x2="140" y2="215" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
              {/* Glowing crystal top */}
              <polygon points="140,25 152,42 140,55 128,42" fill="#38bdf8" />
              <polygon points="140,30 148,42 140,50 132,42" fill="#ffffff" />
              {showWeaponGlow && (
                <circle cx="140" cy="42" r="16" fill="#38bdf8" fillOpacity="0.4" className="animate-ping" />
              )}
            </g>
            {/* Cute Head */}
            <circle cx="100" cy="80" r="32" fill="#ffedd5" />
            {/* Rosy Cheeks */}
            <circle cx="78" cy="90" r="6" fill="#f43f5e" fillOpacity="0.3" />
            <circle cx="122" cy="90" r="6" fill="#f43f5e" fillOpacity="0.3" />
            {/* Big Cute Eyes */}
            <circle cx="86" cy="78" r="7.5" fill="#1e1b4b" />
            <circle cx="89" cy="75" r="3" fill="#ffffff" />
            <circle cx="114" cy="78" r="7.5" fill="#1e1b4b" />
            <circle cx="117" cy="75" r="3" fill="#ffffff" />
            {/* Smile */}
            <path d="M94 92 Q100 97 106 92" stroke="#9a3412" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Pointy Wizard Hat with SAP Yellow Stars */}
            <path d="M50 72 Q100 55 150 72 L120 20 Q100 5 95 18 Z" fill="#581c87" />
            <ellipse cx="100" cy="70" rx="55" ry="12" fill="#6b21a8" />
            <polygon points="105,35 110,45 98,40 112,40 100,45" fill="#fde047" />
            <polygon points="85,50 88,57 80,53 90,53 82,57" fill="#fde047" />
          </g>
        )}

        {race === 'guerreiro' && (
          <g id="guerreiro-character">
            {/* Royal Blue Cape */}
            <path d="M60 100 Q100 85 140 100 L155 195 Q100 215 45 195 Z" fill="#1d4ed8" />
            {/* Shining Armor Plate */}
            <rect x="68" y="110" width="64" height="65" rx="14" fill="#94a3b8" />
            <rect x="76" y="118" width="48" height="45" rx="8" fill="#cbd5e1" />
            <polygon points="100,122 110,138 90,138" fill="#2563eb" />
            {/* Belt & Buckle */}
            <rect x="65" y="172" width="70" height="12" rx="3" fill="#475569" />
            <circle cx="100" cy="178" r="6" fill="#f59e0b" />
            {/* Legs & Sabatons */}
            <rect x="74" y="184" width="20" height="32" rx="6" fill="#64748b" />
            <rect x="106" y="184" width="20" height="32" rx="6" fill="#64748b" />
            <ellipse cx="84" cy="218" rx="13" ry="6" fill="#334155" />
            <ellipse cx="116" cy="218" rx="13" ry="6" fill="#334155" />
            {/* Shield on Left Hand */}
            <g transform={pose === 'attack' ? 'translate(-8, 5)' : ''}>
              <path d="M42 120 Q55 120 58 135 L55 175 Q42 190 28 175 L25 135 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="2.5" />
              <polygon points="42,140 48,155 36,155" fill="#fde047" />
            </g>
            {/* Sword on Right Hand */}
            <g transform={pose === 'attack' ? 'rotate(45 150 140)' : 'rotate(-10 150 140)'}>
              <line x1="150" y1="80" x2="150" y2="185" stroke="#f1f5f9" strokeWidth="7" strokeLinecap="round" />
              <line x1="150" y1="80" x2="150" y2="185" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              <rect x="136" y="150" width="28" height="6" rx="2" fill="#d97706" />
              <circle cx="150" cy="190" r="5" fill="#d97706" />
              {showWeaponGlow && (
                <circle cx="150" cy="80" r="12" fill="#38bdf8" fillOpacity="0.5" className="animate-pulse" />
              )}
            </g>
            {/* Cute Knight Head & Helmet */}
            <circle cx="100" cy="78" r="30" fill="#fed7aa" />
            {/* Visor / Helmet */}
            <path d="M68 70 Q100 45 132 70 L130 50 Q100 35 70 50 Z" fill="#64748b" />
            {/* Blue plume */}
            <path d="M100 45 Q125 15 135 25 Q120 40 100 45" fill="#3b82f6" />
            {/* Friendly Big Eyes */}
            <circle cx="88" cy="78" r="7" fill="#0f172a" />
            <circle cx="90" cy="76" r="2.5" fill="#ffffff" />
            <circle cx="112" cy="78" r="7" fill="#0f172a" />
            <circle cx="114" cy="76" r="2.5" fill="#ffffff" />
            <path d="M96 90 Q100 94 104 90" stroke="#b45309" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        )}

        {race === 'elfo' && (
          <g id="elfo-character">
            {/* Emerald Nature Cape */}
            <path d="M62 105 Q100 90 138 105 L152 200 Q100 220 48 200 Z" fill="#047857" />
            {/* Tunic with Leaf Motifs */}
            <rect x="70" y="112" width="60" height="65" rx="14" fill="#059669" />
            <path d="M85 115 Q100 135 115 115" stroke="#fde047" strokeWidth="2" fill="none" />
            <rect x="68" y="168" width="64" height="10" rx="3" fill="#78350f" />
            <circle cx="100" cy="173" r="5" fill="#34d399" />
            {/* Boots */}
            <rect x="76" y="180" width="18" height="34" rx="6" fill="#1e3a2f" />
            <rect x="106" y="180" width="18" height="34" rx="6" fill="#1e3a2f" />
            <ellipse cx="85" cy="216" rx="12" ry="5" fill="#14532d" />
            <ellipse cx="115" cy="216" rx="12" ry="5" fill="#14532d" />
            {/* Magical Emerald Orb in Hand */}
            <g transform={pose === 'cast' ? 'translate(0, -10)' : ''}>
              <circle cx="140" cy="135" r="14" fill="#34d399" />
              <circle cx="140" cy="135" r="9" fill="#ffffff" />
              {showWeaponGlow && (
                <circle cx="140" cy="135" r="22" fill="#34d399" fillOpacity="0.4" className="animate-ping" />
              )}
            </g>
            {/* Cute Head */}
            <circle cx="100" cy="78" r="30" fill="#fef08a" fillOpacity="0.6" />
            <circle cx="100" cy="78" r="28" fill="#ffedd5" />
            {/* Long Pointy Elf Ears */}
            <polygon points="72,75 40,60 68,90" fill="#fed7aa" />
            <polygon points="128,75 160,60 132,90" fill="#fed7aa" />
            {/* Emerald Tiara */}
            <path d="M75 62 Q100 50 125 62 L120 56 Q100 46 80 56 Z" fill="#d97706" />
            <circle cx="100" cy="54" r="4" fill="#10b981" />
            {/* Sparkling Green Eyes */}
            <circle cx="88" cy="78" r="7.5" fill="#065f46" />
            <circle cx="90" cy="75" r="3" fill="#6ee7b7" />
            <circle cx="91" cy="74" r="1.5" fill="#ffffff" />
            <circle cx="112" cy="78" r="7.5" fill="#065f46" />
            <circle cx="114" cy="75" r="3" fill="#6ee7b7" />
            <circle cx="115" cy="74" r="1.5" fill="#ffffff" />
            <path d="M96 90 Q100 94 104 90" stroke="#047857" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        )}

        {race === 'arqueiro' && (
          <g id="arqueiro-character">
            {/* Ranger Hood & Cloak */}
            <path d="M60 105 Q100 90 140 105 L155 195 Q100 215 45 195 Z" fill="#92400e" />
            {/* Leather Vest & Quiver straps */}
            <rect x="70" y="112" width="60" height="65" rx="12" fill="#b45309" />
            <line x1="72" y1="120" x2="128" y2="170" stroke="#451a03" strokeWidth="5" />
            <rect x="68" y="172" width="64" height="10" rx="3" fill="#451a03" />
            <circle cx="100" cy="177" r="5" fill="#fbbf24" />
            {/* Boots */}
            <rect x="76" y="182" width="18" height="32" rx="6" fill="#78350f" />
            <rect x="106" y="182" width="18" height="32" rx="6" fill="#78350f" />
            <ellipse cx="85" cy="216" rx="12" ry="5" fill="#451a03" />
            <ellipse cx="115" cy="216" rx="12" ry="5" fill="#451a03" />
            {/* Master Bow on Left Hand */}
            <g transform={pose === 'attack' ? 'rotate(-20 50 140)' : 'rotate(10 50 140)'}>
              <path d="M45 70 Q30 140 45 200" stroke="#78350f" strokeWidth="6" strokeLinecap="round" fill="none" />
              <line x1="45" y1="70" x2="45" y2="200" stroke="#e2e8f0" strokeWidth="2" />
              {/* Arrow ready */}
              <line x1="30" y1="135" x2="100" y2="135" stroke="#f59e0b" strokeWidth="3" />
              <polygon points="98,131 108,135 98,139" fill="#0284c7" />
            </g>
            {/* Cute Head & Archer Hood */}
            <circle cx="100" cy="78" r="30" fill="#fed7aa" />
            {/* Green Hood */}
            <path d="M68 80 Q100 40 132 80 L125 50 Q100 30 75 50 Z" fill="#15803d" />
            <polygon points="100,28 92,45 108,45" fill="#166534" />
            {/* Sharp Focused Eyes */}
            <circle cx="88" cy="78" r="7" fill="#1f2937" />
            <circle cx="90" cy="76" r="2.5" fill="#ffffff" />
            <circle cx="112" cy="78" r="7" fill="#1f2937" />
            <circle cx="114" cy="76" r="2.5" fill="#ffffff" />
            <path d="M96 91 Q100 95 104 91" stroke="#92400e" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        )}

        {race === 'espirito' && (
          <g id="espirito-character">
            {/* Celestial Radiant Aura */}
            <circle cx="100" cy="120" r="70" fill={`url(#glow-${race})`} />
            {/* Ethereal Wisp Body */}
            <path
              d="M100 45 C60 45 55 100 70 145 C80 175 100 215 100 215 C100 215 120 175 130 145 C145 100 140 45 100 45 Z"
              fill="#06b6d4"
              fillOpacity="0.85"
            />
            {/* Internal Bright Core */}
            <path
              d="M100 65 C80 65 75 105 85 135 C92 155 100 180 100 180 C100 180 108 155 115 135 C125 105 120 65 100 65 Z"
              fill="#ffffff"
              fillOpacity="0.9"
            />
            {/* Floating Energy Rings */}
            <ellipse cx="100" cy="130" rx="55" ry="15" stroke="#a5f3fc" strokeWidth="3" strokeDasharray="8 6" className="animate-spin" />
            {/* Cute Luminous Eyes */}
            <ellipse cx="88" cy="95" rx="7" ry="10" fill="#082f49" />
            <circle cx="90" cy="92" r="3" fill="#ffffff" />
            <ellipse cx="112" cy="95" rx="7" ry="10" fill="#082f49" />
            <circle cx="114" cy="92" r="3" fill="#ffffff" />
            {/* Tiny ethereal smile */}
            <path d="M96 112 Q100 117 104 112" stroke="#082f49" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Floating Orbs around */}
            <circle cx="50" cy="100" r="8" fill="#67e8f9" className="animate-ping" />
            <circle cx="150" cy="110" r="10" fill="#38bdf8" className="animate-bounce" />
          </g>
        )}

        {/* CROWN FOR HIGH LEVEL HEROES (Level 5+) */}
        {level >= 5 && (
          <g id="hero-crown" transform="translate(0, -10)">
            <polygon points="82,45 88,25 100,38 112,25 118,45" fill="url(#gold-crown)" stroke="#b45309" strokeWidth="1.5" />
            <circle cx="100" cy="38" r="2.5" fill="#e11d48" />
            <circle cx="88" cy="27" r="2" fill="#38bdf8" />
            <circle cx="112" cy="27" r="2" fill="#38bdf8" />
          </g>
        )}
      </svg>
    </div>
  );
};
