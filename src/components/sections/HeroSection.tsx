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
        background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.9) 0%, rgba(15, 10, 50, 0.9) 100%)',
      }}
    >
      {/* Fondo de partículas */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.2,
          pointerEvents: 'none',
          background: `
            radial-gradient(circle at 20% 50%, rgba(218, 165, 32, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(212, 165, 116, 0.1) 0%, transparent 50%)
          `,
        }}
      />

      {/* HUD interactivo — Datos en vivo */}
      <div
        ref={hudRef}
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          color: '#E8E3DA',
          fontFamily: 'monospace',
          fontSize: '12px',
          lineHeight: '1.8',
          textShadow: '0 0 10px rgba(218, 165, 32, 0.4)',
          textAlign: 'left',
          borderLeft: '3px solid #DAA520',
          paddingLeft: '0.75rem',
          background: 'rgba(218, 165, 32, 0.08)',
          padding: '1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 0 20px rgba(218, 165, 32, 0.15)',
        }}
      >
        <p style={{ color: '#A8A39A', margin: '0 0 0.5rem', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          ⚙ RESONANCIA SÓNICA
        </p>
        <p style={{ margin: '0.3rem 0' }}>
          Frecuencia: <span style={{ color: '#DAA520', fontWeight: 'bold' }}>{audioFreq.toFixed(0)} Hz</span>
        </p>
        <p style={{ margin: '0.3rem 0' }}>
          Amplitud: <span style={{ color: '#CD853F', fontWeight: 'bold' }}>
            {(audioGain * 100).toFixed(0)}%
          </span>
        </p>
        <p style={{ margin: '0.3rem 0' }}>
          Ecosistema: <span style={{ color: '#D4A574', fontWeight: 'bold' }}>{healthScore}%</span>
        </p>
        <p style={{ margin: '0.7rem 0 0', fontSize: '9px', color: '#6B6760', fontStyle: 'italic', borderTop: '1px solid rgba(218, 165, 32, 0.2)', paddingTop: '0.5rem' }}>
          Haz clic y mantén para vibrar
        </p>
      </div>

      {/* Contenido principal */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px' }}>
        <h1
          ref={titleRef}
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(42px, 8vw, 84px)',
            background: 'linear-gradient(135deg, #DAA520 0%, #D4A574 50%, #CD853F 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem',
            lineHeight: 1.1,
            filter: 'drop-shadow(0 0 25px rgba(218, 165, 32, 0.3))',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          El zumbido que nos une
        </h1>

        <p
          ref={subtitleRef}
          style={{
            fontSize: 'clamp(16px, 2.2vw, 20px)',
            color: '#A8A39A',
            maxWidth: '620px',
            margin: '0 auto 2.5rem',
            lineHeight: '1.8',
            textShadow: '0 0 10px rgba(218, 165, 32, 0.2)',
            fontWeight: 300,
            letterSpacing: '0.3px',
          }}
        >
          Los pequeños polinizadores que sostienen la vida en Tlalmanalco.
          <br />
          <span style={{ fontSize: 'clamp(14px, 1.8vw, 18px)', color: '#8A7A6B' }}>
            Una historia de ciencia, territorio y esperanza.
          </span>
        </p>

        <div
          style={{
            maxWidth: '680px',
            margin: '2rem auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            fontSize: '13px',
            color: '#A8A39A',
          }}
        >
          <div style={{ background: 'rgba(218, 165, 32, 0.08)', padding: '0.875rem', borderRadius: '8px', borderLeft: '2px solid #DAA520' }}>
            <p style={{ margin: '0 0 0.3rem', color: '#DAA520', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>Frecuencia</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#D4A574' }}>400 Hz</p>
            <p style={{ margin: '0.2rem 0 0', fontSize: '11px', color: '#6B6760' }}>Polinización sónica</p>
          </div>
          <div style={{ background: 'rgba(212, 165, 116, 0.08)', padding: '0.875rem', borderRadius: '8px', borderLeft: '2px solid #D4A574' }}>
            <p style={{ margin: '0 0 0.3rem', color: '#D4A574', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>Impacto</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#DAA520' }}>+50%</p>
            <p style={{ margin: '0.2rem 0 0', fontSize: '11px', color: '#6B6760' }}>Rendimiento de cosecha</p>
          </div>
        </div>

        <p
          ref={scrollHintRef}
          style={{
            fontSize: '13px',
            color: '#DAA520',
            opacity: 0.85,
            letterSpacing: '0.15em',
            margin: 0,
            textTransform: 'uppercase',
            fontWeight: 500,
            animation: 'pulse 2s infinite',
          }}
        >
          ↓ Desplázate para explorar
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(4px); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
