import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const threats = [
  {
    marker: '01',
    title: 'Pérdida de hábitat',
    desc: 'La expansión agrícola y urbana destruye los corredores silvestres donde el Bombus anida y forrajea.',
  },
  {
    marker: '02',
    title: 'Agroquímicos',
    desc: 'Insecticidas como los neonicotinoides deterioran su sistema nervioso y su capacidad de navegación.',
  },
  {
    marker: '03',
    title: 'Cambio climático',
    desc: 'Las temperaturas extremas acortan su ventana de actividad y dessincronizan su ciclo con las flores.',
  },
  {
    marker: '04',
    title: 'Monocultivos',
    desc: 'Campos de un solo cultivo no ofrecen la diversidad floral que el Bombus necesita para sobrevivir.',
  },
];

const ThreatSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const glitchLineRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 60%',
        onEnter: () => {
          const tl = gsap.timeline();
          tl.to(titleRef.current, {
            skewX: 5,
            color: '#ff0096',
            textShadow: '3px 0 #ff0096, -3px 0 #00d4ff',
            duration: 0.08,
            ease: 'none',
          })
            .to(titleRef.current, {
              skewX: -3,
              color: '#ff6600',
              textShadow: '-2px 0 #ff0096, 2px 0 #00d4ff',
              duration: 0.08,
              ease: 'none',
            })
            .to(titleRef.current, {
              skewX: 2,
              color: '#ff0096',
              textShadow: '2px 0 #ff6600, -2px 0 #00d4ff',
              duration: 0.08,
              ease: 'none',
            })
            .to(titleRef.current, {
              skewX: 0,
              color: '#ff0096',
              textShadow: '0 0 20px rgba(255, 0, 150, 0.6), 0 0 40px rgba(255, 102, 0, 0.3)',
              duration: 0.3,
              ease: 'power2.out',
            });

          gsap.from(glitchLineRef.current, {
            scaleX: 0,
            duration: 0.6,
            ease: 'power3.out',
            delay: 0.3,
          });
        },
      });

      gsap.from(cardRefs.current, {
        scrollTrigger: {
          trigger: cardRefs.current[0],
          start: 'top 80%',
        },
        x: -40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
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
        background: 'linear-gradient(135deg, rgba(20, 0, 20, 0.8) 0%, rgba(40, 0, 40, 0.6) 100%)',
        position: 'relative',
      }}
    >
      {/* Fondo amenaza */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.15,
          background: `
            radial-gradient(circle at 50% 50%, rgba(255, 0, 150, 0.3) 0%, transparent 60%)
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
            color: '#E8E3DA',
            marginBottom: '0.5rem',
          }}
        >
          Las Amenazas
        </h2>
        <div
          ref={glitchLineRef}
          style={{
            height: '4px',
            background: 'linear-gradient(90deg, #ff0096, #ff6600, rgba(255, 0, 150, 0.1))',
            marginBottom: '3rem',
            transformOrigin: 'left center',
            boxShadow: '0 0 20px rgba(255, 0, 150, 0.4)',
          }}
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {threats.map((threat, i) => (
            <div
              key={threat.title}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              style={{
                border: '2px solid rgba(255, 0, 150, 0.4)',
                borderRadius: '12px',
                padding: '1.75rem',
                background: 'rgba(255, 0, 150, 0.05)',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 0 15px rgba(255, 0, 150, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 0, 150, 0.3)';
                e.currentTarget.style.borderColor = '#ff0096';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 0, 150, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 0, 150, 0.4)';
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  color: '#ff6600',
                  letterSpacing: '0.15em',
                  marginBottom: '0.75rem',
                  fontWeight: 600,
                }}
              >
                {threat.marker}
              </div>
              <h3
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '18px',
                  color: '#ff0096',
                  marginBottom: '0.5rem',
                  marginTop: 0,
                }}
              >
                {threat.title}
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: '#A8A39A',
                  lineHeight: '1.6',
                  margin: 0,
                }}
              >
                {threat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreatSection;
