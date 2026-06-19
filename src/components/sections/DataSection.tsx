import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const stats = [
  {
    label: 'Valor de polinizacion',
    rawValue: 66320,
    suffix: '',
    unit: 'MDP anuales',
    formatFn: (v: number) => Math.round(v).toLocaleString('en-US'),
  },
  {
    label: 'Diferencial de precio',
    rawValue: 45,
    suffix: '%',
    unit: 'con Bombus',
    formatFn: (v: number) => Math.round(v).toString(),
  },
  {
    label: 'Cultivos dependientes',
    rawValue: 73,
    suffix: '%',
    unit: 'global',
    formatFn: (v: number) => Math.round(v).toString(),
  },
];

const DataSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from(cardRefs.current, {
        scrollTrigger: {
          trigger: cardRefs.current[0],
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
      });

      stats.forEach((stat, i) => {
        const el = counterRefs.current[i];
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: stat.rawValue,
          duration: 2.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none reset',
          },
          onUpdate() {
            el.textContent = stat.formatFn(obj.val) + stat.suffix;
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 2rem',
        background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.8) 0%, rgba(20, 10, 40, 0.8) 100%)',
        position: 'relative',
      }}
    >
      {/* Fondo de luz */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.2,
          background: `
            radial-gradient(circle at 50% 0%, rgba(0, 212, 255, 0.2) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '900px', width: '100%', position: 'relative', zIndex: 10 }}>
        <h2
          ref={titleRef}
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(32px, 5vw, 48px)',
            background: 'linear-gradient(135deg, #00d4ff 0%, #00ff88 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem',
            filter: 'drop-shadow(0 0 15px rgba(0, 212, 255, 0.3))',
          }}
        >
          Por qué importa
        </h2>
        <p
          style={{
            fontSize: '16px',
            lineHeight: '1.8',
            color: '#A8A39A',
            maxWidth: '680px',
            marginBottom: '3rem',
          }}
        >
          El abejorro <em style={{ color: '#00ff88' }}>Bombus</em> realiza la polinización
          sónica del jitomate. Vibra a frecuencias específicas que liberan el
          polen que ningún otro insecto puede alcanzar. Sin ellos, la diferencia
          en cosecha puede ser hasta del{' '}
          <strong style={{ color: '#ff0096' }}>50%</strong>.
        </p>

        {/* YOUTUBE VIDEO EMBED */}
        <div
          style={{
            position: 'relative',
            paddingBottom: '56.25%',
            height: 0,
            overflow: 'hidden',
            marginBottom: '3rem',
            borderRadius: '16px',
            boxShadow: '0 0 40px rgba(0, 255, 136, 0.2), 0 0 80px rgba(0, 212, 255, 0.1)',
            border: '2px solid rgba(0, 255, 136, 0.3)',
          }}
        >
          <iframe
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '14px',
            }}
            src="https://www.youtube.com/embed/KzfvXq6gepE"
            title="Documental Bombus - El zumbido que nos une"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              style={{
                border: '2px solid rgba(0, 255, 136, 0.4)',
                borderRadius: '16px',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                background: 'rgba(0, 255, 136, 0.05)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 0 20px rgba(0, 255, 136, 0.15)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 255, 136, 0.3)';
                e.currentTarget.style.borderColor = '#00ff88';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.4)';
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  color: '#00d4ff',
                  letterSpacing: '0.12em',
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: 'clamp(36px, 5vw, 52px)',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                }}
              >
                <span
                  ref={(el) => {
                    counterRefs.current[i] = el;
                  }}
                >
                  0{stat.suffix}
                </span>
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#6B6760',
                  letterSpacing: '0.05em',
                }}
              >
                {stat.unit}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DataSection;
