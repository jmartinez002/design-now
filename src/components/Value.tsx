import styles from './Value.module.css';

export default function Value() {
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
      </div>
    </section>
  );
}
