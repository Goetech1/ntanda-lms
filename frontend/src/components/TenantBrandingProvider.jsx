import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const TenantBrandingContext = createContext(null);

export const useTenantBranding = () => useContext(TenantBrandingContext);

export const TenantBrandingProvider = ({ children }) => {
  const [tenant, setTenant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const resolveTenant = async () => {
      const hostname = window.location.hostname;
      const apiBaseUrl = API_BASE_URL;
      
      // List of main domains that represent the central platform (no tenant resolution needed)
      const mainDomains = new Set([
        'learningzm.com',
        'www.learningzm.com',
        'ntanda.com',
        'www.ntanda.com'
      ]);

      if (mainDomains.has(hostname)) {
        setTenant(null);
        setIsLoading(false);
        return;
      }

      let lookupSubdomain = null;
      let lookupDomain = null;

      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Fallback for local development using the configured env variables
        lookupSubdomain = import.meta.env.VITE_TENANT_ID;
      } else {
        const parts = hostname.split('.');
        
        // Check if it's a subdomain of our main domains (e.g., demo.learningzm.com)
        const isMainDomainSubdomain = hostname.endsWith('learningzm.com') || hostname.endsWith('ntanda.com');

        if (isMainDomainSubdomain && parts.length > 2) {
          const firstPart = parts[0];
          if (firstPart !== 'www') {
            lookupSubdomain = firstPart;
          }
        } else {
          // If it's not a subdomain of the platform domains, treat it as a custom domain
          lookupDomain = hostname;
        }
      }

      try {
        let url = `${apiBaseUrl}/tenant/resolve`;
        if (lookupDomain) {
          url += `?domain=${encodeURIComponent(lookupDomain)}`;
        } else if (lookupSubdomain) {
          url += `?subdomain=${encodeURIComponent(lookupSubdomain)}`;
        } else {
          setIsLoading(false);
          return;
        }

        const response = await axios.get(url);
        const tenantData = response.data;
        
        setTenant(tenantData);
        sessionStorage.setItem('resolvedTenantId', tenantData.id);
        applyBranding(tenantData.branding);
      } catch (err) {
        console.error('Failed to resolve tenant configuration:', err);
        setError('The portal you are looking for does not exist or has expired.');
      } finally {
        setIsLoading(false);
      }
    };

    const applyBranding = (branding) => {
      if (!branding) return;
      if (branding.primaryColor) {
        document.documentElement.style.setProperty('--primary', branding.primaryColor);
        document.documentElement.style.setProperty('--primary-hover', `${branding.primaryColor}cc`);
        document.documentElement.style.setProperty('--primary-glow', `${branding.primaryColor}4d`);
      }
      if (branding.secondaryColor) {
        document.documentElement.style.setProperty('--secondary', branding.secondaryColor);
        document.documentElement.style.setProperty('--secondary-glow', `${branding.secondaryColor}4d`);
      }
    };

    resolveTenant();
  }, []);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#030712', color: '#f9fafb', fontFamily: 'sans-serif' }}>
        <div style={{ border: '4px solid rgba(255,255,255,0.05)', borderTop: '4px solid #3b82f6', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1.5rem', opacity: 0.7, fontSize: '14px', letterSpacing: '0.05em' }}>RESOLVING PORTAL...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#030712', color: '#f9fafb', fontFamily: 'sans-serif', padding: '20px', textAlign: 'center' }}>
        <div style={{ padding: '24px', backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', maxWidth: '440px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
          <div style={{ width: '56px', height: '56px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <span style={{ fontSize: '28px', fontWeight: 'bold' }}>!</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Institution Not Found</h2>
          <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>{error}</p>
          <a 
            href="https://learningzm.com" 
            style={{ display: 'inline-block', width: '100%', backgroundColor: '#3b82f6', color: '#ffffff', textDecoration: 'none', fontWeight: 'bold', padding: '12px 20px', borderRadius: '8px', fontSize: '14px', transition: 'background-color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
          >
            Back to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <TenantBrandingContext.Provider value={{ tenant }}>
      {children}
    </TenantBrandingContext.Provider>
  );
};
