import { forwardRef } from 'react';

const CertificateTemplate = forwardRef(({ studentName, courseName, issueDate, validationCode, tenantName, logoUrl }, ref) => {
  return (
    <div 
      ref={ref}
      style={{
        width: '1122px', // A4 landscape width
        height: '793px', // A4 landscape height
        backgroundColor: '#f8fafc',
        backgroundImage: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        position: 'relative',
        padding: '40px',
        fontFamily: "'Inter', sans-serif",
        color: '#0f172a',
        boxSizing: 'border-box'
      }}
    >
      {/* Decorative Border */}
      <div style={{
        position: 'absolute',
        top: '20px', left: '20px', right: '20px', bottom: '20px',
        border: '4px solid #334155',
        borderRadius: '12px',
        pointerEvents: 'none'
      }}></div>
      
      {/* Inner Decorative Border */}
      <div style={{
        position: 'absolute',
        top: '30px', left: '30px', right: '30px', bottom: '30px',
        border: '1px solid #94a3b8',
        borderRadius: '8px',
        pointerEvents: 'none'
      }}></div>

      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        
        {/* Header / Logo */}
        <div style={{ marginBottom: '40px' }}>
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" style={{ height: '80px', objectFit: 'contain' }} />
          ) : (
            <div style={{ 
              width: '80px', height: '80px', 
              background: '#0f172a', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white',
              fontSize: '32px',
              fontWeight: 'bold',
              margin: '0 auto'
            }}>
              {tenantName?.charAt(0) || 'N'}
            </div>
          )}
          <h2 style={{ fontSize: '24px', letterSpacing: '2px', textTransform: 'uppercase', color: '#475569', marginTop: '16px', fontWeight: 600 }}>
            {tenantName || 'Ntanda LMS'}
          </h2>
        </div>

        {/* Certificate Title */}
        <h1 style={{ 
          fontSize: '64px', 
          fontWeight: 800, 
          color: '#0f172a', 
          marginBottom: '10px',
          fontFamily: "'Playfair Display', serif" // Optional elegant font
        }}>
          Certificate of Completion
        </h1>
        
        <p style={{ fontSize: '20px', color: '#64748b', marginBottom: '40px' }}>
          This is to certify that
        </p>

        {/* Student Name */}
        <h2 style={{ 
          fontSize: '48px', 
          fontWeight: 700, 
          color: '#2563eb', 
          borderBottom: '2px solid #cbd5e1', 
          paddingBottom: '10px', 
          marginBottom: '40px',
          width: '60%',
          margin: '0 auto 40px auto'
        }}>
          {studentName}
        </h2>

        <p style={{ fontSize: '20px', color: '#64748b', marginBottom: '20px' }}>
          has successfully completed the course
        </p>

        {/* Course Name */}
        <h3 style={{ 
          fontSize: '36px', 
          fontWeight: 700, 
          color: '#0f172a', 
          marginBottom: '60px',
          maxWidth: '80%',
          lineHeight: 1.2
        }}>
          {courseName}
        </h3>

        {/* Footer info */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          width: '80%',
          marginTop: 'auto',
          paddingTop: '40px'
        }}>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', borderBottom: '1px solid #94a3b8', paddingBottom: '5px', width: '200px' }}>
              {new Date(issueDate).toLocaleDateString()}
            </p>
            <p style={{ fontSize: '14px', color: '#64748b', marginTop: '5px' }}>Date of Issue</p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '5px' }}>Verify Authenticity at:</p>
            <p style={{ fontSize: '12px', color: '#0f172a', fontFamily: 'monospace' }}>
              https://learningzm.com/verify/{validationCode}
            </p>
          </div>
        </div>

        {/* Seal Decoration */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 10px 25px -5px rgba(217, 119, 6, 0.5)'
        }}>
          <span style={{ fontSize: '32px' }}>🏆</span>
        </div>
      </div>
    </div>
  );
});

CertificateTemplate.displayName = 'CertificateTemplate';

export default CertificateTemplate;
