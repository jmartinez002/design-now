import styles from './HowItWorks.module.css';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Get the brief',
      desc: 'A new realistic client scenario drops in your inbox every Monday.',
      colorClass: styles.cardYellow
    },
    {
      number: '02',
      title: 'Build your portfolio',
      desc: 'Do the work to stack your portfolio, then submit your final design.',
      colorClass: styles.cardBlue
    },
    {
      number: '03',
      title: 'Get showcased',
      desc: 'Top submissions are featured in our Sunday Showcase.',
      colorClass: styles.cardRed
    },
  ];

  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.container}>
        <h2 className={styles.title}>
          The way design <span className="nostalgic-italic">should</span><br />have been done
        </h2>
        <div className={styles.grid}>
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`${styles.card} ${step.colorClass}`}
            >
              <span className={`${styles.number} font-mono`}>{step.number}</span>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{step.title}</h3>
                <p className={styles.cardDesc}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
