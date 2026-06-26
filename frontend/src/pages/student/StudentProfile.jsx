import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentProfile = () => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const closeModal = () => setActiveModal(null);

  return (
    <main className="max-w-[480px] mx-auto pb-3xl pt-8 animate-fade-up relative">
      {/* Profile Hero Section */}
      <section className="px-margin-mobile py-xl flex flex-col items-center text-center">
        <div className="relative mb-md">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-container p-xs bg-surface-container">
            <img alt="User Avatar" className="w-full h-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOfeG4no9W9LEKAEJwhc_-iynAnkFx3DnkG1S47-cYBU7PPpkyewgJRGkLjUwSuu_890UEfwO4OegZLuhsicUxU1x5w9ybjpI_9bED2lJmg8xRstvhYF36FRRZWXf4KiejqDcm8LCL0gznpwIsGlcASxBAryXOtU2Cb0ESgQEhHCZrVLqFmLfGkSdGpFge2ICJlQyxZH4OUcZmRn0xvMQTbmRdBtLhOg_YpaXs5SQZZOh1RPuqUm1K6_Niz87NnnCWeDHfOvX62BU" />
          </div>
          <button className="absolute bottom-0 right-0 bg-primary text-on-primary p-xs rounded-full shadow-lg border-2 border-surface active:scale-95 transition-transform" onClick={() => setActiveModal('personalDetails')}>
            <span className="material-symbols-outlined !text-[18px]" style={{fontVariationSettings: "'FILL' 0"}}>edit</span>
          </button>
        </div>
        <h1 className="font-headline-sm text-headline-sm text-on-surface mb-xs">Julian Anderson</h1>
        <div className="flex items-center gap-xs text-on-surface-variant">
          <span className="font-label-md text-label-md bg-surface-container-high px-sm py-[2px] rounded-lg tracking-wider">ID: 2024-8842-EF</span>
        </div>
      </section>

      {/* Settings Groups */}
      <div className="space-y-xl px-margin-mobile">
        
        {/* Account Info */}
        <section>
          <h2 className="font-label-sm text-label-sm text-primary uppercase tracking-widest mb-md opacity-80">Account Info</h2>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <button className="w-full flex items-center justify-between p-md hover:bg-surface-container-low transition-colors" onClick={() => setActiveModal('personalDetails')}>
              <div className="flex items-center gap-md">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{fontVariationSettings: "'FILL' 0"}}>person</span>
                </div>
                <span className="font-body-md text-on-surface">Personal Details</span>
              </div>
              <span className="material-symbols-outlined text-outline" style={{fontVariationSettings: "'FILL' 0"}}>chevron_right</span>
            </button>
            <div className="h-[1px] bg-outline-variant/30 mx-md"></div>
            <button className="w-full flex items-center justify-between p-md hover:bg-surface-container-low transition-colors" onClick={() => setActiveModal('emailAddress')}>
              <div className="flex items-center gap-md">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{fontVariationSettings: "'FILL' 0"}}>mail</span>
                </div>
                <span className="font-body-md text-on-surface">Email Address</span>
              </div>
              <span className="material-symbols-outlined text-outline" style={{fontVariationSettings: "'FILL' 0"}}>chevron_right</span>
            </button>
          </div>
        </section>

        {/* Security */}
        <section>
          <h2 className="font-label-sm text-label-sm text-primary uppercase tracking-widest mb-md opacity-80">Security</h2>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <button className="w-full flex items-center justify-between p-md hover:bg-surface-container-low transition-colors" onClick={() => setActiveModal('changePassword')}>
              <div className="flex items-center gap-md">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{fontVariationSettings: "'FILL' 0"}}>lock</span>
                </div>
                <span className="font-body-md text-on-surface">Change Password</span>
              </div>
              <span className="material-symbols-outlined text-outline" style={{fontVariationSettings: "'FILL' 0"}}>chevron_right</span>
            </button>
            <div className="h-[1px] bg-outline-variant/30 mx-md"></div>
            <button className="w-full flex items-center justify-between p-md hover:bg-surface-container-low transition-colors" onClick={() => setTwoFactorAuth(!twoFactorAuth)}>
              <div className="flex items-center gap-md">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{fontVariationSettings: "'FILL' 0"}}>verified_user</span>
                </div>
                <div className="text-left">
                  <span className="font-body-md text-on-surface block">Two-Factor Auth</span>
                  <span className="font-body-sm text-on-surface-variant">Recommended</span>
                </div>
              </div>
              <div className={`px-sm py-xs rounded text-[12px] font-bold transition-colors ${twoFactorAuth ? 'bg-primary text-on-primary' : 'bg-primary/10 text-primary'}`}>
                {twoFactorAuth ? 'ON' : 'OFF'}
              </div>
            </button>
          </div>
        </section>

        {/* Preferences */}
        <section>
          <h2 className="font-label-sm text-label-sm text-primary uppercase tracking-widest mb-md opacity-80">Preferences</h2>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <button className="w-full flex items-center justify-between p-md hover:bg-surface-container-low transition-colors" onClick={() => setActiveModal('language')}>
              <div className="flex items-center gap-md">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{fontVariationSettings: "'FILL' 0"}}>language</span>
                </div>
                <div className="text-left">
                  <span className="font-body-md text-on-surface block">Language</span>
                  <span className="font-body-sm text-on-surface-variant">English (US)</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline" style={{fontVariationSettings: "'FILL' 0"}}>chevron_right</span>
            </button>
            <div className="h-[1px] bg-outline-variant/30 mx-md"></div>
            <button className="w-full flex items-center justify-between p-md hover:bg-surface-container-low transition-colors" onClick={() => setActiveModal('notifications')}>
              <div className="flex items-center gap-md">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{fontVariationSettings: "'FILL' 0"}}>notifications_active</span>
                </div>
                <span className="font-body-md text-on-surface">Notifications</span>
              </div>
              <span className="material-symbols-outlined text-outline" style={{fontVariationSettings: "'FILL' 0"}}>chevron_right</span>
            </button>
          </div>
        </section>

        {/* Privacy */}
        <section>
          <h2 className="font-label-sm text-label-sm text-primary uppercase tracking-widest mb-md opacity-80">Privacy</h2>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <button className="w-full flex items-center justify-between p-md hover:bg-surface-container-low transition-colors" onClick={() => setActiveModal('privacy')}>
              <div className="flex items-center gap-md">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{fontVariationSettings: "'FILL' 0"}}>visibility_off</span>
                </div>
                <span className="font-body-md text-on-surface">Privacy Settings</span>
              </div>
              <span className="material-symbols-outlined text-outline" style={{fontVariationSettings: "'FILL' 0"}}>chevron_right</span>
            </button>
          </div>
        </section>

        {/* Links */}
        <section className="pt-md pb-24">
          <div className="flex flex-col gap-sm">
            <button onClick={() => navigate('/student/support')} className="w-full flex items-center gap-md p-md text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>help</span>
              <span className="font-body-md font-medium">Help & Support</span>
            </button>
            <button className="w-full flex items-center gap-md p-md text-on-surface-variant hover:text-primary transition-colors" onClick={() => setActiveModal('privacyPolicy')}>
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>policy</span>
              <span className="font-body-md font-medium">Privacy Policy</span>
            </button>
            <button onClick={() => navigate('/login')} className="w-full flex items-center gap-md p-md text-error hover:bg-error/5 rounded-lg transition-colors mt-lg">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>logout</span>
              <span className="font-body-md font-medium">Log Out</span>
            </button>
          </div>
        </section>
      </div>

      {/* Dynamic Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-md">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-sm rounded-xl shadow-2xl overflow-hidden animate-fade-up">
            <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
              <h2 className="text-headline-sm font-bold text-on-surface capitalize">
                {activeModal.replace(/([A-Z])/g, ' $1').trim()}
              </h2>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all" onClick={closeModal}>
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>close</span>
              </button>
            </div>
            
            <div className="p-lg space-y-md">
              {activeModal === 'personalDetails' && (
                <>
                  <input type="text" defaultValue="Julian Anderson" className="w-full border border-outline-variant rounded-lg p-3" placeholder="Full Name" />
                  <input type="text" defaultValue="2024-8842-EF" disabled className="w-full border border-outline-variant rounded-lg p-3 bg-surface-container-low text-on-surface-variant" placeholder="Student ID" />
                  <button className="w-full bg-primary text-on-primary font-bold py-3 rounded-lg" onClick={closeModal}>Save Changes</button>
                </>
              )}
              {activeModal === 'emailAddress' && (
                <>
                  <input type="email" defaultValue="julian.a@university.edu" className="w-full border border-outline-variant rounded-lg p-3" placeholder="Email Address" />
                  <button className="w-full bg-primary text-on-primary font-bold py-3 rounded-lg" onClick={closeModal}>Update Email</button>
                </>
              )}
              {activeModal === 'changePassword' && (
                <>
                  <input type="password" placeholder="Current Password" className="w-full border border-outline-variant rounded-lg p-3" />
                  <input type="password" placeholder="New Password" className="w-full border border-outline-variant rounded-lg p-3" />
                  <input type="password" placeholder="Confirm New Password" className="w-full border border-outline-variant rounded-lg p-3" />
                  <button className="w-full bg-primary text-on-primary font-bold py-3 rounded-lg" onClick={closeModal}>Change Password</button>
                </>
              )}
              {activeModal === 'language' && (
                <>
                  <select className="w-full border border-outline-variant rounded-lg p-3">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                  <button className="w-full bg-primary text-on-primary font-bold py-3 rounded-lg" onClick={closeModal}>Save Language</button>
                </>
              )}
              {activeModal === 'notifications' && (
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <span>Push Notifications</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span>Email Alerts</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
                  </label>
                  <button className="w-full bg-primary text-on-primary font-bold py-3 rounded-lg mt-4" onClick={closeModal}>Save Preferences</button>
                </div>
              )}
              {activeModal === 'privacy' && (
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <span>Public Profile</span>
                    <input type="checkbox" className="w-5 h-5 accent-primary" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span>Show Online Status</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
                  </label>
                  <button className="w-full bg-primary text-on-primary font-bold py-3 rounded-lg mt-4" onClick={closeModal}>Save Settings</button>
                </div>
              )}
              {activeModal === 'privacyPolicy' && (
                <>
                  <p className="text-body-sm text-on-surface-variant max-h-48 overflow-y-auto pr-2">
                    Ntanda Learning values your privacy. We collect minimal personal data to provide educational services. Your data is encrypted and never sold to third parties. For full details on our data retention and cookies, please refer to our full terms of service at ntanda.com/terms.
                  </p>
                  <button className="w-full border border-outline-variant font-bold py-3 rounded-lg mt-4 hover:bg-surface-container-low" onClick={closeModal}>Close</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default StudentProfile;
