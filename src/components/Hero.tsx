'use client';

import styles from './Hero.module.css';

interface HeroProps {
  onCtaClick: () => void;
}

export default function Hero({ onCtaClick }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.stickyContainer}>
        <div className={styles.content} style={{ marginTop: '-100px', letterSpacing: '-0.05em' }}>
          <h1 className={styles.headline}>
            <div style={{ marginBottom: '12px' }}>Open briefs</div>
            <div>
              for <span className="nostalgic-italic" style={{ color: 'var(--brand-yellow)' }}>designers</span>
            </div>
          </h1>
          <p className={styles.subtext}>
            Get realistic client briefs delivered every Monday. <br />Submit your designs to build your portfolio and get featured.
          </p>
          <button className={styles.cta} onClick={onCtaClick}>
            Get your first brief
          </button>
        </div>
      </div>
    </section>
  );
}
