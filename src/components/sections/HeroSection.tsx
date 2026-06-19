import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useEcosystemStore } from '../../store/useEcosystemStore';

gsap.registerPlugin(useGSAP);

const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollHintRef = useRef<HTMLParagraphElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);

  const audioFreq = useEcosystemStore((s) => s.audioFrequency);
  const audioGain = useEcosystemStore((s) => s.audioGain);
  const healthScore = useEcosystemStore((s) => s.healthScore);

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.3 });
      tl.from(titleRef.current, {
        y: 80,
        opacity: 0,
        duration: 1.4,
        ease: 'power4.out',
      })
        .from(
          subtitleRef.current,
          { y: 30, opacity: 0, duration: 1, ease: 'power3.out' },
          '-=0.8'
        )
        .from(
          scrollHintRef.current,
          { opacity: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.4'
        )
        .from(
          hudRef.current,
          { x: -20, opacity: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.6'
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.8) 0%, rgba(15, 10, 50, 0.8) 100%)',
      }}
    >
      {/* Fondo de partículas de luz */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.3,
          pointerEvents: 'none',
          background: `
            radial-gradient(circle at 20% 50%, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 0, 150, 0.1) 0%, transparent 50%)
          `,
        }}
      />

      {/* HUD interactivo */}
      <div
        ref={hudRef}
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          color: '#E8E3DA',
          fontFamily: 'monospace',
          fontSize: '13px',
          lineHeight: '1.8',
          textShadow: '0 0 10px rgba(0, 255, 136, 0.5), 0 0 20px rgba(0, 255, 136, 0.2)',
          textAlign: 'left',
          borderLeft: '3px solid #00ff88',
          paddingLeft: '0.75rem',
          background: 'rgba(0, 255, 136, 0.05)',
          padding: '1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 0 20px rgba(0, 255, 136, 0.2)',
        }}
      >
        <p style={{ color: '#A8A39A', margin: '0 0 0.5rem', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          ⚡ INTERACTIVO
        </p>
        <p style={{ margin: '0.3rem 0' }}>
          Frecuencia:{' '}
          <span style={{ color: '#00ff88', fontWeight: 'bold' }}>{audioFreq.toFixed(0)} Hz</span>
        </p>
        <p style={{ margin: '0.3rem 0' }}>
          Amplitud:{' '}
          <span style={{ color: '#ff0096', fontWeight: 'bold' }}>
            {(audioGain * 100).toFixed(0)}%
          </span>
        </p>
        <p style={{ margin: '0.3rem 0' }}>
          Salud:{' '}
          <span style={{ color: '#00d4ff', fontWeight: 'bold' }}>{healthScore}%</span>
        </p>
      </div>

      {/* Contenido principal */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <h1
          ref={titleRef}
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(36px, 7vw, 72px)',
            background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 50%, #ff0096 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem',
            lineHeight: 1.15,
            filter: 'drop-shadow(0 0 20px rgba(0, 255, 136, 0.3))',
          }}
        >
          El zumbido que nos une
        </h1>
        <p
          ref={subtitleRef}
          style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: '#A8A39A',
            maxWidth: '560px',
            margin: '0 auto 2.5rem',
            lineHeight: '1.7',
            textShadow: '0 0 10px rgba(0, 255, 136, 0.2)',
          }}
        >
          Los pequeños polinizadores que sostienen la vida en Tlalmanalco.
          Una historia de ciencia, territorio y esperanza.
        </p>
        <p
          ref={scrollHintRef}
          style={{
            fontSize: '13px',
            color: '#00ff88',
            opacity: 0.9,
            letterSpacing: '0.15em',
            margin: 0,
            textTransform: 'uppercase',
            animation: 'pulse 2s infinite',
          }}
        >
          ↓ Desplázate para explorar
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
