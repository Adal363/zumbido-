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
    label: 'Reducir agroquimicos',
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
        .set(pulseRef.current, { opacity: 0.6, scale: 0 })
        .to(pulseRef.current, {
          scale: 4,
          opacity: 0,
          duration: 0.9,
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
      }}
    >
      {/* Pulso de sanacion */}
      <div
        ref={pulseRef}
        style={{
          position: 'absolute',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(88,166,93,0.5) 0%, transparent 70%)',
          pointerEvents: 'none',
          opacity: 0,
          zIndex: 0,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
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
            color: '#D4A574',
            marginBottom: '1rem',
            textAlign: 'center',
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
          El <em style={{ color: '#E8E3DA' }}>Bombus</em> de Tlalmanalco
          existe, trabaja y{' '}
          <strong style={{ color: '#58A65D' }}>puede recuperarse</strong> — si
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
            <span style={{ color: '#58A65D', fontWeight: 600 }}>
              {healthScore}%
            </span>
          </div>
          <div
            style={{
              height: '8px',
              background: 'rgba(41, 53, 46, 0.6)',
              borderRadius: '99px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${healthScore}%`,
                background: 'linear-gradient(90deg, #29B35E, #58A65D)',
                borderRadius: '99px',
                transition: 'width 0.8s ease-out',
                boxShadow: '0 0 12px rgba(88, 166, 93, 0.5)',
              }}
            />
          </div>
        </div>

        {/* Botones de accion */}
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
                    ? 'rgba(88, 166, 93, 0.12)'
                    : '#58A65D',
                  color: done ? '#58A65D' : '#0D1510',
                  border: done ? '1px solid rgba(88, 166, 93, 0.4)' : 'none',
                  borderRadius: '99px',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: done ? 'default' : 'pointer',
                  transition:
                    'box-shadow 0.2s ease-out, background 0.4s ease',
                  boxShadow: done
                    ? 'none'
                    : '0 0 20px rgba(88, 166, 93, 0.3)',
                  width: '100%',
                  maxWidth: '400px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  if (!done) {
                    e.currentTarget.style.boxShadow =
                      '0 0 35px rgba(88, 166, 93, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!done) {
                    e.currentTarget.style.boxShadow =
                      '0 0 20px rgba(88, 166, 93, 0.3)';
                  }
                }}
              >
                <span>{item.label}</span>
                <span
                  style={{
                    fontSize: '12px',
                    opacity: 0.75,
                    marginLeft: '1rem',
                  }}
                >
                  {done ? 'hecho' : item.gain}
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
