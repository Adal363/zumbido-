import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const threats = [
  {
    marker: '01',
    title: 'Perdida de habitat',
    desc: 'La expansion agricola y urbana destruye los corredores silvestres donde el Bombus anida y forrajea.',
  },
  {
    marker: '02',
    title: 'Agroquimicos',
    desc: 'Insecticidas como los neonicotinoides deterioran su sistema nervioso y su capacidad de navegacion.',
  },
  {
    marker: '03',
    title: 'Cambio climatico',
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
      // Glitch de titulo al entrar en viewport
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 60%',
        onEnter: () => {
          const tl = gsap.timeline();
          tl.to(titleRef.current, {
            skewX: 15,
            color: '#FF2020',
            textShadow: '4px 0 #FF0000, -4px 0 #00FFFF',
            duration: 0.05,
            ease: 'none',
          })
            .to(titleRef.current, {
              skewX: -8,
              color: '#1a0000',
              textShadow: '-3px 0 #FF0000, 3px 0 #00FFFF',
              duration: 0.05,
              ease: 'none',
            })
            .to(titleRef.current, {
              skewX: 5,
              color: '#FF2020',
              textShadow: '2px 0 #FF4444, -2px 0 #00CCCC',
              duration: 0.08,
              ease: 'none',
            })
            .to(titleRef.current, {
              skewX: 0,
              color: '#E8341C',
              textShadow: '0 0 20px rgba(255, 32, 32, 0.6)',
              duration: 0.2,
              ease: 'power2.out',
            });

          // Linea roja de entrada
          gsap.from(glitchLineRef.current, {
            scaleX: 0,
            duration: 0.6,
            ease: 'power3.out',
            delay: 0.3,
          });
        },
      });

      // Cards desde la izquierda
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
        background: 'rgba(10, 0, 0, 0.3)',
      }}
    >
      <div style={{ maxWidth: '900px', width: '100%' }}>
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
            height: '3px',
            background: 'linear-gradient(90deg, #FF2020, #FF6600, transparent)',
            marginBottom: '3rem',
            transformOrigin: 'left center',
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
                border: '1px solid rgba(232, 52, 28, 0.2)',
                borderRadius: '12px',
                padding: '1.75rem',
                background: 'rgba(30, 0, 0, 0.4)',
                backdropFilter: 'blur(6px)',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  color: '#E8341C',
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
                  color: '#E8341C',
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
