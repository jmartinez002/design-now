import styles from './HowItWorks.module.css';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Sign up',
      desc: 'Join Abierto and prepare for your first assignment.',
      colorClass: styles.cardYellow
    },
    {
      number: '02',
      title: 'Get a brief',
      desc: 'Receive a realistic client scenario in your inbox every Sunday.',
      colorClass: styles.cardBlue
    },
    {
      number: '03',
      title: 'Build portfolio',
      desc: 'Design and build your work to attract real clients.',
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
