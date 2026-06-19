import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEcosystemStore } from '../../store/useEcosystemStore';
import type { RestorationAction } from '../../store/useEcosystemStore';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const actions: {
  label: string;
  action: RestorationAction;
  gain: string;
}[] = [
  {
    label: 'Plantar flores nativas',
    action: 'native_flowers',
    gain: '+12% salud',
  },
  {
    label: 'Reducir agroquímicos',
    action: 'reduce_chemicals',
    gain: '+15% salud',
  },
  {
    label: 'Conservar bordes silvestres',
    action: 'conserve_borders',
    gain: '+10% salud',
  },
];

const RestorationSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pulseRef = useRef<HTMLDivElement>(null);

  const healthScore = useEcosystemStore((s) => s.healthScore);
  const restorationActions = useEcosystemStore((s) => s.restorationActions);
  const addAction = useEcosystemStore((s) => s.addRestorationAction);

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

      gsap.from(buttonRefs.current, {
        scrollTrigger: {
          trigger: buttonRefs.current[0],
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
      });
    },
    { scope: sectionRef }
  );

  const handleAction = (action: RestorationAction, index: number) => {
    if (restorationActions.includes(action)) return;
    addAction(action);

    const btn = buttonRefs.current[index];
    if (btn) {
      gsap.timeline()
        .to(btn, { scale: 1.08, duration: 0.12, ease: 'power2.out' })
        .to(btn, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    }

    if (pulseRef.current) {
      gsap.timeline()
        .set(pulseRef.current, { opacity: 0.8, scale: 0 })
        .to(pulseRef.current, {
          scale: 6,
          opacity: 0,
          duration: 1.2,
          ease: 'power2.out',
        });
    }
  };

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 2rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(10, 30, 20, 0.8) 0%, rgba(10, 14, 39, 0.8) 100%)',
      }}
    >
      {/* Pulso de sanación */}
      <div
        ref={pulseRef}
        style={{
          position: 'absolute',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0, 255, 136, 0.6) 0%, transparent 70%)',
          pointerEvents: 'none',
          opacity: 0,
          zIndex: 0,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 40px rgba(0, 255, 136, 0.5)',
        }}
      />

      {/* Fondo de luz sanadora */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.15,
          background: `
            radial-gradient(circle at 50% 50%, rgba(0, 255, 136, 0.2) 0%, transparent 60%)
          `,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '680px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <h2
          ref={titleRef}
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(32px, 5vw, 48px)',
            background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 50%, #d4a574 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem',
            textAlign: 'center',
            filter: 'drop-shadow(0 0 15px rgba(0, 255, 136, 0.3))',
          }}
        >
          Lo que podemos hacer
        </h2>
        <p
          style={{
            fontSize: '16px',
            color: '#A8A39A',
            lineHeight: '1.8',
            textAlign: 'center',
            marginBottom: '1rem',
          }}
        >
          El <em style={{ color: '#00ff88' }}>Bombus</em> de Tlalmanalco
          existe, trabaja y{' '}
          <strong style={{ color: '#00ff88' }}>puede recuperarse</strong> — si
          le damos las condiciones adecuadas.
        </p>

        {/* Barra de salud del ecosistema */}
        <div style={{ margin: '2rem auto 3rem', maxWidth: '400px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#6B6760',
              marginBottom: '0.5rem',
            }}
          >
            <span>Salud del ecosistema</span>
            <span style={{ color: '#00ff88', fontWeight: 600 }}>
              {healthScore}%
            </span>
          </div>
          <div
            style={{
              height: '10px',
              background: 'rgba(0, 255, 136, 0.1)',
              borderRadius: '99px',
              overflow: 'hidden',
              border: '1px solid rgba(0, 255, 136, 0.3)',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${healthScore}%`,
                background: 'linear-gradient(90deg, #00ff88, #00d4ff, #00ff88)',
                borderRadius: '99px',
                transition: 'width 0.8s ease-out',
                boxShadow: '0 0 15px rgba(0, 255, 136, 0.6), inset 0 0 10px rgba(0, 255, 136, 0.3)',
              }}
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          {actions.map((item, i) => {
            const done = restorationActions.includes(item.action);
            return (
              <button
                key={item.action}
                ref={(el) => {
                  buttonRefs.current[i] = el;
                }}
                onClick={() => handleAction(item.action, i)}
                disabled={done}
                style={{
                  padding: '1rem 2rem',
                  background: done
                    ? 'rgba(0, 255, 136, 0.1)'
                    : 'linear-gradient(135deg, #00ff88, #00d4ff)',
                  color: done ? '#00ff88' : '#0a0e27',
                  border: done ? '2px solid rgba(0, 255, 136, 0.4)' : '2px solid rgba(0, 255, 136, 0.6)',
                  borderRadius: '99px',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: done ? 'default' : 'pointer',
                  transition:
                    'box-shadow 0.2s ease-out, background 0.4s ease, transform 0.2s ease',
                  boxShadow: done
                    ? 'none'
                    : '0 0 25px rgba(0, 255, 136, 0.4)',
                  width: '100%',
                  maxWidth: '400px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  if (!done) {
                    e.currentTarget.style.boxShadow =
                      '0 0 40px rgba(0, 255, 136, 0.7), 0 0 60px rgba(0, 212, 255, 0.4)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!done) {
                    e.currentTarget.style.boxShadow =
                      '0 0 25px rgba(0, 255, 136, 0.4)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <span>{item.label}</span>
                <span
                  style={{
                    fontSize: '12px',
                    opacity: done ? 1 : 0.85,
                    marginLeft: '1rem',
                  }}
                >
                  {done ? '✓ hecho' : item.gain}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RestorationSection;
