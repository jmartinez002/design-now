import styles from './Value.module.css';

export default function Value() {
  const benefits = [
    'Realistic client scenarios',
    'Consistent creative practice',
    'Portfolio-ready work',
    'Push creative boundaries',
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            It’s <span className="nostalgic-italic" style={{ padding: '0 8px' }}>"your vision made visible"</span> better
          </h2>
          <p className={styles.subtitle}>
            Join a community of designers making their portfolio work stand out with beautiful, industry-accurate client scenarios and weekly showcases.
          </p>
        </div>
        <div className={styles.grid}>
          {benefits.map((benefit, i) => (
            <div key={i} className={styles.item}>
              <div className={styles.iconWrapper}>
                <svg
                  className={styles.check}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className={styles.itemText}>{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
