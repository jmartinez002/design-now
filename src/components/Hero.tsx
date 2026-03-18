'use client';

import { useEffect, useState } from 'react';
import styles from './Hero.module.css';

interface HeroProps {
  onCtaClick: () => void;
}

export default function Hero({ onCtaClick }: HeroProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const maxScale = 2.2;
  const phaseLength = 400; 

  // "Open briefs" shrinks from maxScale to 1
  const openBriefsScale = scrollY < phaseLength 
    ? Math.max(1, maxScale - (scrollY / phaseLength) * (maxScale - 1))
    : 1;

  // "designers" grows earlier as requested
  const startGrowing = 100; // Trigger the scaling much sooner
  let designersScale = 1;
  if (scrollY > startGrowing && scrollY <= startGrowing + phaseLength) {
    designersScale = 1 + ((scrollY - startGrowing) / phaseLength) * (maxScale - 1);
  } else if (scrollY > startGrowing + phaseLength && scrollY <= startGrowing + 2 * phaseLength) {
    designersScale = Math.max(1, maxScale - ((scrollY - (startGrowing + phaseLength)) / phaseLength) * (maxScale - 1));
  }

  return (
    <section className={styles.hero}>
      <div className={styles.stickyContainer}>
        <div className={styles.content} style={{ marginTop: '-50px', letterSpacing: '-0.05em' }}>
          <h1 className={styles.headline}>
            <div 
              style={{ 
                transform: `scale(${openBriefsScale})`, 
                transformOrigin: 'left center',
                display: 'inline-block',
                willChange: 'transform',
                marginBottom: '40px'
              }}
            >
              Open briefs
            </div>
            <br />
            <div>
              for{' '}
              <span 
                className="nostalgic-italic"
                style={{ 
                  color: 'var(--brand-yellow)',
                  transform: `scale(${designersScale})`,
                  transformOrigin: 'left center',
                  display: 'inline-block',
                  willChange: 'transform'
                }}
              >
                designers
              </span>
            </div>
          </h1>
          <p className={styles.subtext}>
            Get real client briefs delivered weekly. <br/>Build portfolio work that actually feels real.
          </p>
          <button className={styles.cta} onClick={onCtaClick}>
            Get your first brief
          </button>
        </div>
      </div>
    </section>
  );
}
