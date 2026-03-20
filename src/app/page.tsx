'use client';

import Link from 'next/link';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Value from '@/components/Value';
import SignupForm from '@/components/SignupForm';

export default function Home() {
  const scrollToSignup = () => {
    document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <header style={{
          padding: 'clamp(20px, 6vw, 40px) clamp(20px, 6vw, 40px) 12px clamp(20px, 6vw, 40px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          width: '100%',
          backgroundColor: 'transparent',
          zIndex: 50
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="nostalgic-italic" style={{ fontSize: '2.5rem', lineHeight: 1 }}>abierto</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link 
              href="/submit"
              style={{
                backgroundColor: '#000000',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '10px 24px',
                borderRadius: '99px',
                fontSize: '0.875rem',
                fontWeight: '600',
                border: '1px solid #333'
              }}
            >
              Submit
            </Link>
            <button
              onClick={scrollToSignup}
              style={{
                zIndex: 1000,
                backgroundColor: 'var(--brand-yellow)',
                color: 'var(--background)',
                padding: '10px 24px',
                borderRadius: '99px',
                fontSize: '0.875rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer'

              }}>
              Get Started
            </button>
          </div>
        </header>

        <main>
          <Hero onCtaClick={scrollToSignup} />
          <HowItWorks />
          <Value />
          <SignupForm />
        </main>
      </div>

      <footer style={{
        backgroundColor: '#000000',
        color: '#ffffff',
        width: '100%',
        marginTop: '100px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '80px clamp(20px, 6vw, 40px) 120px clamp(20px, 6vw, 40px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div className="nostalgic-italic" style={{ fontSize: '3rem', lineHeight: 1 }}>abierto</div>
          </div>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '500', lineHeight: '1.1', marginBottom: '16px', letterSpacing: '-0.04em' }}>
            See if Abierto Briefs is<br />the right fit for you<br /><span className="nostalgic-italic" style={{ color: 'var(--brand-yellow)' }}>it totally is</span>
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: '1.125rem', marginBottom: '80px', maxWidth: '400px' }}>
            Get realistic client scenarios delivered every Monday, submit or email your work, and get featured in the Sunday showcase.
          </p>

          <img src="/smile.svg" alt="Smile" className="footer-smile" />

          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: '1px solid #333',
            paddingTop: '40px'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#71717a' }}>
              &copy; 2026 Abierto. All rights reserved.
            </div>
            <div className="font-mono" style={{ fontSize: '0.875rem', color: '#71717a' }}>
              SYSTEM / ONLINE
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
