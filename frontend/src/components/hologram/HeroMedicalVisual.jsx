import React from 'react';

/**
 * HeroMedicalVisual
 * 
 * Medical visual enhancement over hero-page.jpeg with:
 * 1. Full-Body Blood Circulation (Arterial systolic waves & returning venous flow)
 * 2. Heart and Vein Connection (Central heartbeat synchronized with blood flow)
 * 3. Glowing Brain Structure Inside the Head with active neural pathways
 * 4. Concentric Migraine Pain Animation at the temple with "Migraine Activity" indicator
 * 5. Callout overlays (Brain, Heart, Nerve, Blood Vessels, Diabetes Risk gauge)
 */
const HeroMedicalVisual = () => {
  return (
    <div className="relative w-full max-w-2xl select-none">
      {/* Background Soft Ambient Moving Glow */}
      <div className="absolute -inset-4 sm:-inset-6 hero-ambient-glow rounded-3xl blur-2xl pointer-events-none -z-10" />

      {/* Main Illustration Container with slow floating & breathing motion */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-border/60 bg-white shadow-card hero-body-float">
        
        {/* Soft Blue Energy Glow Behind Central Body */}
        <div
          className="absolute top-[6%] left-[20%] w-[30%] h-[82%] rounded-full bg-cyan-400/20 blur-2xl pointer-events-none body-energy-glow z-0"
          aria-hidden="true"
        />

        {/* Base Hero Illustration (hero-page.jpeg preserved intact) */}
        <img
          src="/hero-page.jpeg"
          alt="JeevanSetu AI Healthcare Prediction"
          className="relative z-10 w-full h-auto object-contain block"
          loading="eager"
        />

        {/* =========================================================================
            SVG ANATOMICAL OVERLAY: FULL-BODY CIRCULATION, BRAIN & MIGRAINE
            Exact 1:1 coordinate alignment matching hero-page.jpeg (936 x 552)
            ========================================================================= */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
          viewBox="0 0 936 552"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Glow Filters for Vessels, Synapses, and Migraine */}
            <filter id="arterialGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#ef4444" floodOpacity="0.8" />
            </filter>
            <filter id="venousGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.2" floodColor="#00e5ff" floodOpacity="0.85" />
            </filter>
            <filter id="brainGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.0" floodColor="#00f0ff" floodOpacity="0.9" />
            </filter>
            <filter id="migraineGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#f43f5e" floodOpacity="0.95" />
            </filter>

            {/* Cranium Clip Path: Keeps the brain strictly inside the head */}
            <clipPath id="headCraniumClip">
              <ellipse cx="323" cy="58" rx="16.5" ry="20" />
            </clipPath>
          </defs>

          {/* -----------------------------------------------------------------------
              1 & 2. FULL-BODY BLOOD CIRCULATION (ARTERIES & VEINS)
              Originates and converges at the Heart: (323, 148)
              ----------------------------------------------------------------------- */}

          {/* ARTERIES: Oxygenated Blood Flow from Heart -> Head, Arms, Abdomen, Legs */}
          <g filter="url(#arterialGlow)">
            {/* Carotid Arteries -> Head */}
            <path
              d="M 323 148 L 321 115 L 319 82 L 317 65"
              stroke="#ff4d4d"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="artery-pulse-flow"
            />
            <path
              d="M 323 148 L 325 115 L 327 82 L 330 65"
              stroke="#ff4d4d"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="artery-pulse-flow"
            />

            {/* Subclavian & Brachial Arteries -> Left Arm */}
            <path
              d="M 323 148 C 308 142, 285 138, 270 152 L 257 186 L 246 230 L 238 270"
              stroke="#ff5722"
              strokeWidth="1.9"
              strokeLinecap="round"
              className="artery-pulse-flow"
            />

            {/* Subclavian & Brachial Arteries -> Right Arm */}
            <path
              d="M 323 148 C 338 142, 361 138, 376 152 L 389 186 L 400 230 L 408 270"
              stroke="#ff5722"
              strokeWidth="1.9"
              strokeLinecap="round"
              className="artery-pulse-flow"
            />

            {/* Descending Aorta -> Abdomen & Pelvis */}
            <path
              d="M 323 148 L 323 205 L 323 260"
              stroke="#ff3b30"
              strokeWidth="2.2"
              strokeLinecap="round"
              className="artery-pulse-flow"
            />

            {/* Iliac & Femoral Arteries -> Left Leg */}
            <path
              d="M 323 260 L 312 305 L 305 355 L 298 410 L 293 455"
              stroke="#ff4d4d"
              strokeWidth="1.9"
              strokeLinecap="round"
              className="artery-pulse-flow"
            />

            {/* Iliac & Femoral Arteries -> Right Leg */}
            <path
              d="M 323 260 L 334 305 L 341 355 L 348 410 L 353 455"
              stroke="#ff4d4d"
              strokeWidth="1.9"
              strokeLinecap="round"
              className="artery-pulse-flow"
            />
          </g>

          {/* VEINS: Returning Deoxygenated Blood Flow -> Heart */}
          <g filter="url(#venousGlow)">
            {/* Jugular Veins returning from Head */}
            <path
              d="M 314 65 L 318 115 L 321 148"
              stroke="#00e5ff"
              strokeWidth="1.6"
              strokeLinecap="round"
              className="vein-return-flow"
            />
            <path
              d="M 333 65 L 328 115 L 325 148"
              stroke="#00e5ff"
              strokeWidth="1.6"
              strokeLinecap="round"
              className="vein-return-flow"
            />

            {/* Cephalic & Basilic Veins returning from Left Arm */}
            <path
              d="M 235 270 L 243 230 L 254 186 L 267 152 C 282 138, 305 142, 321 148"
              stroke="#00d2ff"
              strokeWidth="1.6"
              strokeLinecap="round"
              className="vein-return-flow"
            />

            {/* Cephalic & Basilic Veins returning from Right Arm */}
            <path
              d="M 411 270 L 403 230 L 392 186 L 379 152 C 364 138, 341 142, 325 148"
              stroke="#00d2ff"
              strokeWidth="1.6"
              strokeLinecap="round"
              className="vein-return-flow"
            />

            {/* Inferior Vena Cava & Saphenous Veins returning from Left Leg */}
            <path
              d="M 289 455 L 294 410 L 301 355 L 308 305 L 321 260 L 321 205 L 321 148"
              stroke="#00e5ff"
              strokeWidth="1.7"
              strokeLinecap="round"
              className="vein-return-flow"
            />

            {/* Inferior Vena Cava & Saphenous Veins returning from Right Leg */}
            <path
              d="M 357 455 L 352 410 L 345 355 L 338 305 L 325 260 L 325 205 L 325 148"
              stroke="#00e5ff"
              strokeWidth="1.7"
              strokeLinecap="round"
              className="vein-return-flow"
            />
          </g>

          {/* -----------------------------------------------------------------------
              3. VISIBLE, GLOWING & ANIMATED BRAIN STRUCTURE INSIDE THE HEAD
              Clipped strictly to the head cranium: Center (323, 58)
              ----------------------------------------------------------------------- */}
          <g clipPath="url(#headCraniumClip)">
            {/* Brain Hemisphere Silhouettes with vibrant cyan/blue luminescence */}
            <path
              d="M 322 39 C 312 39, 307 45, 308 55 C 308 63, 314 68, 322 68 Z"
              fill="#00e5ff"
              fillOpacity="0.32"
              className="cranial-brain-glow"
            />
            <path
              d="M 324 39 C 334 39, 339 45, 338 55 C 338 63, 332 68, 324 68 Z"
              fill="#00e5ff"
              fillOpacity="0.32"
              className="cranial-brain-glow"
            />

            {/* Cerebellum and Brainstem */}
            <path
              d="M 317 68 Q 323 71, 329 68 L 326 77 L 320 77 Z"
              fill="#0284c7"
              fillOpacity="0.4"
              className="cranial-brain-glow"
            />

            {/* Anatomical Sulci & Gyri Brain Fold Contours */}
            <path
              d="M 312 48 Q 318 45, 321 50"
              stroke="#00f0ff"
              strokeWidth="1.3"
              strokeLinecap="round"
              fill="none"
              className="cranial-gyri-line"
            />
            <path
              d="M 310 56 Q 316 54, 321 59"
              stroke="#00f0ff"
              strokeWidth="1.3"
              strokeLinecap="round"
              fill="none"
              className="cranial-gyri-line"
            />
            <path
              d="M 334 48 Q 328 45, 325 50"
              stroke="#00f0ff"
              strokeWidth="1.3"
              strokeLinecap="round"
              fill="none"
              className="cranial-gyri-line"
            />
            <path
              d="M 336 56 Q 330 54, 325 59"
              stroke="#00f0ff"
              strokeWidth="1.3"
              strokeLinecap="round"
              fill="none"
              className="cranial-gyri-line"
            />
            <path
              d="M 315 64 Q 323 61, 331 64"
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
              className="cranial-gyri-line"
            />

            {/* Longitudinal Central Fissure & Spinal Trunk Stream */}
            <path
              d="M 323 39 L 323 77"
              stroke="#ffffff"
              strokeWidth="1.6"
              strokeLinecap="round"
              className="cranial-synapse-active"
              filter="url(#brainGlow)"
            />

            {/* Active Synaptic Pathways with traveling electrical signals */}
            <path
              d="M 313 51 Q 318 46 323 52 T 333 49"
              stroke="#00f0ff"
              strokeWidth="1.4"
              strokeLinecap="round"
              className="cranial-synapse-active"
            />
            <path
              d="M 315 58 Q 320 62 325 58 T 332 60"
              stroke="#f97316"
              strokeWidth="1.3"
              strokeLinecap="round"
              className="cranial-synapse-active-2"
            />
            <path
              d="M 318 44 Q 323 48 328 44"
              stroke="#fbbf24"
              strokeWidth="1.3"
              strokeLinecap="round"
              className="cranial-synapse-active"
              style={{ animationDelay: '0.8s' }}
            />
            <path
              d="M 317 66 Q 323 72 329 66"
              stroke="#00e5ff"
              strokeWidth="1.2"
              strokeLinecap="round"
              className="cranial-synapse-active-2"
            />

            {/* Neural Synaptic Nodes firing action potentials */}
            <circle cx="313" cy="51" r="1.8" fill="#ffffff" filter="url(#brainGlow)" className="cranial-node-fire" />
            <circle cx="323" cy="40" r="2.0" fill="#00f0ff" filter="url(#brainGlow)" className="cranial-node-fire" />
            <circle cx="333" cy="49" r="1.8" fill="#ffffff" filter="url(#brainGlow)" className="cranial-node-fire" style={{ animationDelay: '0.4s' }} />
            <circle cx="323" cy="52" r="2.2" fill="#38bdf8" filter="url(#brainGlow)" className="cranial-node-fire" style={{ animationDelay: '0.8s' }} />
            <circle cx="317" cy="59" r="1.6" fill="#f97316" className="cranial-node-fire" style={{ animationDelay: '1.2s' }} />
            <circle cx="329" cy="59" r="1.6" fill="#fbbf24" className="cranial-node-fire" style={{ animationDelay: '1.6s' }} />
            <circle cx="323" cy="68" r="1.8" fill="#00f0ff" className="cranial-node-fire" style={{ animationDelay: '2.0s' }} />
          </g>
        </svg>

        {/* =========================================================================
            HEARTBEAT PULSE BLOOM (Connected directly to the vessel network)
            ========================================================================= */}
        {/* Central Anatomical Heart on Body */}
        <div
          className="absolute top-[26.8%] left-[34.5%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none z-25 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="absolute w-6 h-6 rounded-full border border-red-500/70 cardiac-pulse-ring" />
          <div className="w-4 h-4 rounded-full bg-red-500/50 blur-xs heartbeat-anatomical" />
        </div>

        {/* Heart Callout Circle Accent Pulse */}
        <div
          className="absolute top-[31.7%] left-[71.0%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 pointer-events-none z-25 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="absolute w-8 h-8 rounded-full border border-red-400/40 cardiac-pulse-ring" style={{ animationDelay: '0.15s' }} />
          <div className="w-5 h-5 rounded-full bg-red-500/25 blur-xs heartbeat-anatomical" />
        </div>

        {/* =========================================================================
            BRAIN CIRCLE CALLOUT SYNAPSE OVERLAY (X: 56.3%, Y: 13.4%)
            ========================================================================= */}
        <div
          className="absolute top-[13.4%] left-[56.3%] -translate-x-1/2 -translate-y-1/2 w-[12.4%] aspect-square rounded-full overflow-hidden pointer-events-none z-20"
          aria-hidden="true"
        >
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
            <path
              d="M 30 50 Q 45 35 55 48 T 75 45"
              stroke="#00f0ff"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="brain-synapse-stream"
            />
            <path
              d="M 38 62 Q 52 50 68 60"
              stroke="#f97316"
              strokeWidth="1.6"
              strokeLinecap="round"
              className="brain-synapse-stream"
              style={{ animationDelay: '1.2s' }}
            />
            <path
              d="M 45 35 L 50 65"
              stroke="#38bdf8"
              strokeWidth="1.4"
              className="brain-synapse-stream"
              style={{ animationDelay: '0.6s' }}
            />
            <circle cx="30" cy="50" r="2.8" fill="#ffffff" className="brain-node-pulse-blue" />
            <circle cx="55" cy="48" r="3.2" fill="#00e5ff" className="brain-node-pulse-blue" />
            <circle cx="75" cy="45" r="2.8" fill="#ffffff" className="brain-node-pulse-blue" />
            <circle cx="52" cy="50" r="3.0" fill="#f97316" className="brain-node-pulse-orange" />
            <circle cx="68" cy="60" r="2.6" fill="#fb923c" className="brain-node-pulse-orange" />
          </svg>
        </div>

        {/* =========================================================================
            NERVE CIRCLE CALLOUT GOLDEN FLOW (X: 81.2%, Y: 54.3%)
            ========================================================================= */}
        <div
          className="absolute top-[54.3%] left-[81.2%] -translate-x-1/2 -translate-y-1/2 w-[12.2%] aspect-square rounded-full overflow-hidden pointer-events-none z-20"
          aria-hidden="true"
        >
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
            <path
              d="M 20 65 Q 40 50 60 45 T 85 30"
              stroke="#fbbf24"
              strokeWidth="2.4"
              strokeLinecap="round"
              className="nerve-spark-golden"
            />
            <path
              d="M 48 48 Q 65 35 80 20"
              stroke="#f59e0b"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="nerve-spark-golden-delayed"
            />
            <path
              d="M 52 50 Q 70 60 85 70"
              stroke="#fcd34d"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="nerve-spark-golden"
              style={{ animationDelay: '1.4s' }}
            />
          </svg>
        </div>

        {/* =========================================================================
            BLOOD VESSEL CIRCLE CALLOUT PARTICLE FLOW (X: 58.8%, Y: 67.4%)
            ========================================================================= */}
        <div
          className="absolute top-[67.4%] left-[58.8%] -translate-x-1/2 -translate-y-1/2 w-[12.2%] aspect-square rounded-full overflow-hidden pointer-events-none z-20 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-red-500/10 rounded-full vessel-ambient-glow" />
          <div className="absolute w-2 h-2 rounded-full bg-red-500/80 vessel-particle-red-1 shadow-[0_0_4px_#ef4444]" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-red-400/80 vessel-particle-red-2 shadow-[0_0_3px_#f87171]" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-sky-400/80 vessel-particle-blue-1 shadow-[0_0_3px_#38bdf8]" />
          <div className="absolute w-2 h-2 rounded-full bg-cyan-300/80 vessel-particle-blue-2 shadow-[0_0_4px_#00e5ff]" />
        </div>

        {/* =========================================================================
            HEALTH STATUS INDICATOR DOTS WITH STAGGERED FADE PULSE
            ========================================================================= */}
        <div className="absolute top-[13.5%] left-[75.8%] -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-400/50 blur-[1px] status-dot-pulse-1 pointer-events-none z-20" aria-hidden="true" />
        <div className="absolute top-[31.5%] left-[87.2%] -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-400/50 blur-[1px] status-dot-pulse-2 pointer-events-none z-20" aria-hidden="true" />
        <div className="absolute top-[52.2%] left-[97.2%] -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-400/50 blur-[1px] status-dot-pulse-3 pointer-events-none z-20" aria-hidden="true" />
        <div className="absolute top-[68.0%] left-[78.8%] -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-400/50 blur-[1px] status-dot-pulse-4 pointer-events-none z-20" aria-hidden="true" />

        {/* =========================================================================
            DIABETES RISK GAUGE ANIMATION (0% -> 12% on load)
            ========================================================================= */}
        <div
          className="absolute top-[86.2%] left-[70.8%] -translate-x-1/2 -translate-y-1/2 w-[3.8%] aspect-square pointer-events-none z-20 flex items-center justify-center"
          aria-hidden="true"
        >
          <svg className="w-full h-full -rotate-90 diabetes-gauge-glow" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="14"
              className="text-emerald-500 diabetes-gauge-ring"
              strokeWidth="3.2"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
            />
          </svg>
        </div>

      </div>
    </div>
  );
};

export default HeroMedicalVisual;
