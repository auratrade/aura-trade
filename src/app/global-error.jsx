'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{
        margin: 0,
        minHeight: '100vh',
        background: '#05070f',
        color: '#e6edf7',
        fontFamily: 'Tajawal, system-ui, sans-serif',
        display: 'grid',
        placeItems: 'center',
        padding: 20,
      }}>
        <div style={{ textAlign: 'center', maxWidth: 500 }}>
          <h1 style={{ fontSize: 32, marginBottom: 12, color: '#f5b041' }}>
            خطأ حرج
          </h1>
          <p style={{ color: '#7d8aab', marginBottom: 20, lineHeight: 1.8 }}>
            نعتذر، حدث خطأ في النظام. يرجى تحديث الصفحة.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '12px 24px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #f5b041, #ff8c42)',
              color: '#0a0f1c',
              border: 'none',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            إعادة المحاولة
          </button>
        </div>
      </body>
    </html>
  );
}