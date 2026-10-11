function CuteFace({ emotion }) {
  const configs = {
    neutral:  { eyes: 'normal',  mouth: 'smile',  blush: false, tears: false, bg: '#FFF3E0' },
    happy:    { eyes: 'happy',   mouth: 'big',    blush: true,  tears: false, bg: '#FCE4EC' },
    excited:  { eyes: 'star',    mouth: 'open',   blush: true,  tears: false, bg: '#F3E5F5' },
    sad:      { eyes: 'sad',     mouth: 'frown',  blush: false, tears: true,  bg: '#E3F2FD' },
    angry:    { eyes: 'angry',   mouth: 'angry',  blush: false, tears: false, bg: '#FFEBEE' },
    thinking: { eyes: 'normal',  mouth: 'flat',   blush: false, tears: false, bg: '#F5F5F5' },
    shy:      { eyes: 'shy',     mouth: 'small',  blush: true,  tears: false, bg: '#FCE4EC' },
    sleepy:   { eyes: 'sleepy',  mouth: 'small',  blush: false, tears: false, bg: '#E8EAF6' },
    love:     { eyes: 'heart',   mouth: 'big',    blush: true,  tears: false, bg: '#FCE4EC' },
    confused: { eyes: 'confused',mouth: 'wavy',   blush: false, tears: false, bg: '#E0F2F1' },
  };

  const c = configs[emotion] || configs.neutral;

  return (
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500"
      style={{ backgroundColor: c.bg }}
    >
      <svg viewBox="0 0 100 100" className="w-14 h-14">
        {/* EYES */}
        {c.eyes === 'normal' && (
          <>
            <circle cx="35" cy="42" r="5" fill="#333" />
            <circle cx="65" cy="42" r="5" fill="#333" />
            <circle cx="37" cy="40" r="1.5" fill="white" />
            <circle cx="67" cy="40" r="1.5" fill="white" />
          </>
        )}
        {c.eyes === 'happy' && (
          <>
            <path d="M 28 42 Q 35 35, 42 42" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 58 42 Q 65 35, 72 42" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        )}
        {c.eyes === 'sad' && (
          <>
            <path d="M 28 38 Q 35 44, 42 38" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 58 38 Q 65 44, 72 38" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="35" cy="46" r="2" fill="#333" />
            <circle cx="65" cy="46" r="2" fill="#333" />
          </>
        )}
        {c.eyes === 'angry' && (
          <>
            <line x1="28" y1="36" x2="42" y2="42" stroke="#333" strokeWidth="3" strokeLinecap="round" />
            <line x1="72" y1="36" x2="58" y2="42" stroke="#333" strokeWidth="3" strokeLinecap="round" />
            <circle cx="35" cy="44" r="4" fill="#333" />
            <circle cx="65" cy="44" r="4" fill="#333" />
          </>
        )}
        {c.eyes === 'star' && (
          <>
            <text x="28" y="48" fontSize="16" fill="#FFD700">✦</text>
            <text x="58" y="48" fontSize="16" fill="#FFD700">✦</text>
          </>
        )}
        {c.eyes === 'sleepy' && (
          <>
            <line x1="28" y1="42" x2="42" y2="42" stroke="#333" strokeWidth="3" strokeLinecap="round" />
            <line x1="58" y1="42" x2="72" y2="42" stroke="#333" strokeWidth="3" strokeLinecap="round" />
          </>
        )}
        {c.eyes === 'shy' && (
          <>
            <circle cx="35" cy="42" r="4" fill="#333" />
            <circle cx="65" cy="42" r="4" fill="#333" />
            <circle cx="37" cy="40" r="1.5" fill="white" />
            <circle cx="67" cy="40" r="1.5" fill="white" />
            <line x1="25" y1="35" x2="45" y2="38" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="75" y1="35" x2="55" y2="38" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
          </>
        )}
        {c.eyes === 'heart' && (
          <>
            <text x="27" y="48" fontSize="14" fill="#E91E63">♥</text>
            <text x="57" y="48" fontSize="14" fill="#E91E63">♥</text>
          </>
        )}
        {c.eyes === 'confused' && (
          <>
            <circle cx="35" cy="42" r="5" fill="none" stroke="#333" strokeWidth="2.5" />
            <circle cx="35" cy="42" r="2" fill="#333" />
            <circle cx="65" cy="42" r="5" fill="#333" />
          </>
        )}

        {/* MOUTH */}
        {c.mouth === 'smile' && (
          <path d="M 40 60 Q 50 68, 60 60" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}
        {c.mouth === 'big' && (
          <path d="M 38 58 Q 50 72, 62 58" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}
        {c.mouth === 'open' && (
          <ellipse cx="50" cy="63" rx="8" ry="6" fill="#333" />
        )}
        {c.mouth === 'frown' && (
          <path d="M 40 65 Q 50 58, 60 65" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}
        {c.mouth === 'angry' && (
          <path d="M 40 64 L 50 60 L 60 64" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}
        {c.mouth === 'flat' && (
          <line x1="42" y1="62" x2="58" y2="62" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
        )}
        {c.mouth === 'small' && (
          <path d="M 45 62 Q 50 65, 55 62" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}
        {c.mouth === 'wavy' && (
          <path d="M 40 62 Q 45 65, 50 62 Q 55 59, 60 62" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}

        {/* BLUSH / CHEEKS */}
        {c.blush && (
          <>
            <ellipse cx="25" cy="55" rx="7" ry="4" fill="#FFCDD2" opacity="0.7" />
            <ellipse cx="75" cy="55" rx="7" ry="4" fill="#FFCDD2" opacity="0.7" />
          </>
        )}

        {/* TEARS */}
        {c.tears && (
          <>
            <path d="M 30 50 Q 28 56, 30 58 Q 32 56, 30 50" fill="#64B5F6" />
            <path d="M 70 50 Q 68 56, 70 58 Q 72 56, 70 50" fill="#64B5F6" />
          </>
        )}
      </svg>
    </div>
  );
}

export default CuteFace;