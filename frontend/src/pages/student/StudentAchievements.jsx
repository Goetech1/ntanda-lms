import { useState, useEffect, useRef } from 'react';
import { Download, Award, ShieldCheck, ExternalLink, Loader2, Star, Zap, Trophy, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { studentPortalService, gamificationService } from '../../services/api';
import { useTenantBranding } from '../../components/TenantBrandingProvider';
import { useAuth } from '../../context/AuthContext';
import CertificateTemplate from '../../components/course/CertificateTemplate';

const StudentAchievements = () => {
  const { tenant } = useTenantBranding();
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [badges, setBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(null); // Track which cert is downloading
  const certificateRef = useRef(null);
  const [activeTab, setActiveTab] = useState('certificates');

  // We need to keep track of the currently "rendering" certificate to pass data to the off-screen template
  const [activeCert, setActiveCert] = useState(null);

  useEffect(() => {
    Promise.all([fetchCertificates(), fetchBadges()]).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await studentPortalService.getMyCertificates();
      setCertificates(res.data);
    } catch (error) {
      console.error('Failed to fetch certificates', error);
      // For demo purposes if API fails:
      setCertificates([
        {
          id: '1',
          course: { title: 'Advanced Cloud Architecture' },
          validation_code: 'CERT-9823-XYZ',
          created_at: new Date().toISOString()
        }
      ]);
    }
  };

  const fetchBadges = async () => {
    try {
      const res = await gamificationService.getMyBadges();
      setBadges(res.data);
    } catch (error) {
      console.error('Failed to fetch badges', error);
      setBadges([
        {
          id: '1',
          badge: {
            title: 'Fast Learner',
            description: 'Completed your first lesson on Ntanda!',
            icon_name: 'Zap'
          }
        },
        {
          id: '2',
          badge: {
            title: 'Knowledge Scholar',
            description: 'Enrolled in a sequential learning path.',
            icon_name: 'Star'
          }
        }
      ]);
    }
  };

  const handleDownload = async (cert) => {
    setIsDownloading(cert.id);
    setActiveCert(cert);
    
    // Give React a tick to render the activeCert in the hidden div
    setTimeout(async () => {
      try {
        const element = certificateRef.current;
        if (!element) throw new Error("Certificate template not found");

        // Use html2canvas to take a snapshot of the hidden DOM element
        const canvas = await html2canvas(element, {
          scale: 2, // High resolution
          useCORS: true,
          logging: false
        });

        const imgData = canvas.toDataURL('image/png');
        
        // A4 dimensions in mm (landscape)
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${cert.course?.title.replace(/\s+/g, '_')}_Certificate.pdf`);

      } catch (err) {
        console.error("Error generating PDF", err);
        alert("Failed to generate certificate PDF.");
      } finally {
        setIsDownloading(null);
        setActiveCert(null);
      }
    }, 500);
  };

  const renderBadgeIcon = (iconName) => {
    switch (iconName) {
      case 'Star': return <Star className="h-10 w-10 text-yellow-400" />;
      case 'Zap': return <Zap className="h-10 w-10 text-cyan-400" />;
      case 'Trophy': return <Trophy className="h-10 w-10 text-amber-500" />;
      case 'Award':
      default: return <Award className="h-10 w-10 text-[var(--primary)]" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Award className="h-8 w-8 text-[var(--primary)]" />
          My Achievements
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Manage, review, and download your earned credentials and badges.</p>
      </div>

      {/* Tab Selectors */}
      <div className="flex gap-4 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('certificates')}
          className={`pb-4 px-2 font-semibold text-sm transition-all border-b-2 ${
            activeTab === 'certificates' 
              ? 'text-white border-[var(--primary)]' 
              : 'text-slate-400 border-transparent hover:text-white'
          }`}
        >
          Certificates ({certificates.length})
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`pb-4 px-2 font-semibold text-sm transition-all border-b-2 ${
            activeTab === 'badges' 
              ? 'text-white border-[var(--primary)]' 
              : 'text-slate-400 border-transparent hover:text-white'
          }`}
        >
          Earned Badges ({badges.length})
        </button>
      </div>

      {activeTab === 'certificates' ? (
        certificates.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="h-10 w-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No certificates yet</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              Complete courses to earn certificates. They will appear here automatically for you to download and share.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div key={cert.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-[var(--primary)]/50 transition-all">
                
                {/* Thumbnail Placeholder */}
                <div className="aspect-[1.4] bg-slate-800 relative overflow-hidden flex items-center justify-center border-b border-slate-800">
                  <Award className="h-24 w-24 text-slate-700 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center backdrop-blur-md">
                    <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Verified
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight">
                    {cert.course?.title || 'Unknown Course'}
                  </h3>
                  <p className="text-sm text-slate-400 mt-2">
                    Issued: {new Date(cert.created_at).toLocaleDateString()}
                  </p>

                  <div className="mt-6 flex items-center gap-3">
                    <button 
                      onClick={() => handleDownload(cert)}
                      disabled={isDownloading === cert.id}
                      className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isDownloading === cert.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Generating...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" /> Download PDF
                        </>
                      )}
                    </button>
                    <a 
                      href={`/verify/${cert.validation_code}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700"
                      title="Public Verification Link"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        badges.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-10 w-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No badges yet</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              Unlock unique skills badges by making stellar progress in lessons or finishing learning paths!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {badges.map((award) => (
              <div key={award.id} className="bg-slate-900 border border-slate-850 rounded-2xl p-6 text-center space-y-4 hover:border-yellow-500/30 transition-all relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                
                {/* Badge Icon Display */}
                <div className="w-20 h-20 mx-auto rounded-full bg-slate-800 flex items-center justify-center shadow-inner border border-slate-700/50 relative">
                  {renderBadgeIcon(award.badge?.icon_name)}
                  <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-slate-950 rounded-full p-1 border border-slate-900 shadow">
                    <Sparkles className="h-3 w-3" />
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-bold text-lg">{award.badge?.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{award.badge?.description}</p>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Hidden container for rendering the certificate off-screen before capturing */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        {activeCert && (
          <CertificateTemplate 
            ref={certificateRef}
            studentName={user?.fullName || "Student Name"}
            courseName={activeCert.course?.title || "Course Name"}
            issueDate={activeCert.created_at || new Date().toISOString()}
            validationCode={activeCert.validation_code || "XXXX-XXXX"}
            tenantName={tenant?.name}
            logoUrl={tenant?.branding?.logoUrl}
          />
        )}
      </div>
    </div>
  );
};

export default StudentAchievements;
