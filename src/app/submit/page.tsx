'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Submit.module.css';

export default function SubmitPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="nostalgic-italic" style={{ fontSize: '2.5rem', lineHeight: 1 }}>abierto</div>
        </Link>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Submit your <span className="nostalgic-italic" style={{ color: 'var(--brand-yellow)' }}>work</span>
          </h1>
          <p className={styles.subtitle}>
            Drop a link to your Figma, Dribbble, or live website. The top 5 submissions are hand-picked and featured every Saturday.
          </p>

          <div className={styles.formCard}>
            {status === 'success' ? (
              <div className={styles.successState}>
                <div className={styles.successIconWrapper}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h2>Received.</h2>
                <p>Thanks for submitting. Keep an eye out for the Saturday showcase!</p>
                <button onClick={() => setStatus('idle')} className={styles.resetBtn}>Submit another</button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <input className={styles.input} type="text" id="firstName" name="firstName" placeholder="First Name" required />
                  </div>
                  <div className={styles.field}>
                    <input className={styles.input} type="text" id="lastName" name="lastName" placeholder="Last Name" required />
                  </div>
                </div>

                <div className={styles.field}>
                  <input className={styles.input} type="email" id="email" name="email" placeholder="Email" required />
                </div>

                <div className={styles.field}>
                  <input className={styles.input} type="text" id="portfolioLink" name="portfolioLink" placeholder="Link to Work (figma.com/...)" required />
                  <span className={styles.helpText}>Figma, Dribbble, Twitter, or Personal Website</span>
                </div>

                <div className={styles.field}>
                  <textarea className={styles.textarea} id="message" name="message" placeholder="Note (optional)" rows={3} />
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={status === 'loading'}
                >
                  <div className={styles.btnIconWrapper}>
                    <svg className={styles.btnIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                  {status === 'loading' ? 'Sending...' : 'Submit Showcase'}
                </button>
                {status === 'error' && (
                  <div className={styles.errorText}>Something went wrong. Please check your connection and try again.</div>
                )}
              </form>
            )}
          </div>

          <div style={{ marginTop: '24px', fontSize: '0.875rem', color: '#000' }}>
            Prefer to just send a file? <a href="mailto:hello@abiertostudio.com?subject=Saturday Showcase Submission" style={{ color: '#000', textDecoration: 'underline' }}>Email your submission</a> directly to us.
          </div>
        </div>
      </main>
    </div>
  );
}
