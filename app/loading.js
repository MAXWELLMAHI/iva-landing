"use client";

export default function Loading() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      background: '#f5f5f5',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        border: '8px solid #f3f3f3',
        borderTop: '8px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
      }}></div>
      <p style={{
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        color: '#333',
        textAlign: 'center'
      }}>
        Loading IVA Platform...<br/>
        <span style={{ fontSize: '14px', opacity: 0.7 }}>Please wait while we load your images</span>
      </p>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 