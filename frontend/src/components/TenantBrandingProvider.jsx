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
      
      // Check if this is the main domain
      if (hostname === 'learningzm.com' || hostname === 'www.learningzm.com') {
        setTenant(null);
        setIsLoading(false);
        return;
      }

      // Determine lookup key: parsed subdomain or custom domain
      let lookupKey = hostname;
      
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        lookupKey = null;
      } else {
        const parts = hostname.split('.');
        // For subdomains (e.g. paclent.localhost or paclent.lmsplatform.com)
        if (parts.length > 1) {
          const firstPart = parts[0];
          if (firstPart !== 'www') {
            lookupKey = firstPart;
          }
        }
      }

      if (!lookupKey) {
      // Fallback to static VITE_TENANT_ID for local dev without subdomain
      const fallbackId = import.meta.env.VITE_TENANT_ID;
      if (fallbackId) {
        try {
          const response = await axios.get(`${apiBaseUrl}/tenant/resolve?subdomain=${fallbackId}`);
          const tenantData = response.data;
          setTenant(tenantData);
          sessionStorage.setItem('resolvedTenantId', tenantData.id);
          applyBranding(tenantData.branding);
        } catch (err) {
          console.error('Failed to resolve fallback tenant:', err);
        }
      }
      setIsLoading(false);
      return;
      }

      try {
      const response = await axios.get(`${apiBaseUrl}/tenant/resolve?subdomain=${lookupKey}`);
      const tenantData = response.data;
      setTenant(tenantData);
      sessionStorage.setItem('resolvedTenantId', tenantData.id);
      applyBranding(tenantData.branding);
      } catch (err) {
      console.error('Failed to resolve tenant for host:', lookupKey, err);
      setError('Institution portal not found.');
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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#050505', color: '#fff', fontFamily: 'sans-serif' }}>
        <div style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid #00e5ff', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem', opacity: 0.8 }}>Resolving institution portal...</p>
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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#050505', color: '#fff', fontFamily: 'sans-serif', padding: '20px', textAlign: 'center' }}>
        <h2 style={{ color: '#ff3366' }}>Portal Error</h2>
        <p style={{ opacity: 0.8, maxWidth: '400px', margin: '10px 0 20px 0' }}>{error}</p>
        <p style={{ fontSize: '14px', color: '#94a3b8' }}>Please verify the URL or contact your school administrator.</p>
      </div>
    );
  }

  return (
    <TenantBrandingContext.Provider value={{ tenant }}>
      {children}
    </TenantBrandingContext.Provider>
  );
};
