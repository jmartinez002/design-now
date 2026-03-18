'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './SignupForm.module.css';

export default function SignupForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/signup', {
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
    <section className={styles.section} id="signup">
      <div className={styles.wrapper}>

        <div className={styles.topContent}>

          {/* Left Column: Text & Badge */}
          <div className={styles.leftCol}>
            <Image
              src="/smc.png"
              alt="Monthly Club Card"
              width={260}
              height={180}
              className={styles.floatingImage}
            />
            <div className={styles.badge}>
              <span className={styles.yellowDot}></span>
              Start today
            </div>
            <h2 className={styles.mainTitle}>
              Join <br />
              <span className="nostalgic-italic" style={{ fontWeight: 'normal' }}>Abierto Briefs</span>
            </h2>
          </div>

          {/* Right Column: Pricing/Form Card */}
          <div className={styles.rightCol}>
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <h3>Monthly Club</h3>
                <div className={styles.pauseBadge}>PAUSE OR CANCEL ANYTIME</div>
              </div>

              <hr className={styles.divider} />

              <div className={styles.pricingDisplay}>
                <span className={styles.priceStr}>Free</span>
                <span className={styles.priceMonth}>/forever</span>
              </div>

              {status === 'success' ? (
                <div className={styles.successState}>
                  <h2 className={styles.successHeadline}>You’re in.</h2>
                  <p className={styles.successSubtext}>Your first brief lands Sunday. No fluff.</p>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.formFields}>
                    <div className={styles.row}>
                      <div className={styles.field}>
                        <input className={styles.input} type="text" id="firstName" name="firstName" placeholder="First Name" required />
                      </div>
                      <div className={styles.field}>
                        <input className={styles.input} type="text" id="lastName" name="lastName" placeholder="Last Name" required />
                      </div>
                    </div>
                    <div className={styles.field}>
                      <input className={styles.input} type="email" id="email" name="email" placeholder="Business Email" required />
                    </div>
                    <div className={styles.field}>
                      <input className={styles.input} type="text" id="studioName" name="studioName" placeholder="Brand / Studio Name (optional)" />
                    </div>
                  </div>

                  <div className={styles.submitContainer}>
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
                      {status === 'loading' ? 'Submitting...' : 'Join today'}
                    </button>
                    {status === 'error' && (
                      <div style={{ color: '#ff3b30', fontSize: '0.875rem', marginTop: '12px', textAlign: 'center' }}>Something went wrong. Please try again.</div>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Info Boxes */}
        <div className={styles.bottomBoxes}>
          <div className={styles.infoBox}>
            <div className={styles.infoBoxHeader}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="10" y1="15" x2="10" y2="9"></line>
                <line x1="14" y1="15" x2="14" y2="9"></line>
              </svg>
              Pause anytime
            </div>
            <p>Temporarily pause your subscription anytime, no sweat.</p>
          </div>

          <div className={styles.infoBox}>
            <div className={styles.infoBoxHeader}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              Try it for a month
            </div>
            <p>Not loving it after a week? Unsubscribe with one click, no questions asked.</p>
          </div>
        </div>

      </div>
    </section>
  );
}
