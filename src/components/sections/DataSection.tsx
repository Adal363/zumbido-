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
      // Titulo
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

      // Cards con stagger
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

      // Animacion countup para cada stat
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
      }}
    >
      <div style={{ maxWidth: '900px', width: '100%' }}>
        <h2
          ref={titleRef}
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(32px, 5vw, 48px)',
            color: '#D4A574',
            marginBottom: '1.5rem',
          }}
        >
          Por que importa?
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
          El abejorro{' '}
          <em style={{ color: '#E8E3DA' }}>Bombus</em> realiza la polinizacion
          sonica del jitomate. Vibra a frecuencias especificas que liberan el
          polen que ningun otro insecto puede alcanzar. Sin ellos, la diferencia
          en cosecha puede ser hasta del{' '}
          <strong style={{ color: '#D4A574' }}>50%</strong>.
        </p>

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
                border: '1px solid rgba(41, 53, 46, 0.8)',
                borderRadius: '16px',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                background: 'rgba(13, 21, 16, 0.4)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  color: '#6B6760',
                  letterSpacing: '0.12em',
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: 'clamp(36px, 5vw, 52px)',
                  fontWeight: 700,
                  color: '#D4A574',
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
