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
      }}
    >
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
          lineHeight: '1.7',
          textShadow: '0 0 10px rgba(157, 0, 255, 0.3)',
          textAlign: 'left',
          borderLeft: '2px solid rgba(157, 0, 255, 0.4)',
          paddingLeft: '0.75rem',
        }}
      >
        <p style={{ color: '#A8A39A', margin: '0 0 0.25rem' }}>
          Click y manten para vibrar
        </p>
        <p style={{ margin: 0 }}>
          Frecuencia:{' '}
          <span style={{ color: '#39FF14' }}>{audioFreq.toFixed(0)} Hz</span>
        </p>
        <p style={{ margin: 0 }}>
          Amplitud:{' '}
          <span style={{ color: '#FF4500' }}>
            {(audioGain * 100).toFixed(0)}%
          </span>
        </p>
        <p style={{ margin: 0 }}>
          Ecosistema:{' '}
          <span style={{ color: '#58A65D' }}>{healthScore}%</span>
        </p>
      </div>

      {/* Contenido principal */}
      <div>
        <h1
          ref={titleRef}
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(36px, 7vw, 72px)',
            color: '#D4A574',
            marginBottom: '1.5rem',
            lineHeight: 1.15,
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
          }}
        >
          Los pequenos polinizadores que sostienen la vida en Tlalmanalco.
          Una historia de ciencia, territorio y esperanza.
        </p>
        <p
          ref={scrollHintRef}
          style={{
            fontSize: '13px',
            color: '#58A65D',
            opacity: 0.7,
            letterSpacing: '0.1em',
            margin: 0,
          }}
        >
          v desplazate para explorar
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
