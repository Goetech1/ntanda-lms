import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Search, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { studentPortalService, ltiService } from '../../services/api';
import { setAccessToken } from '../../services/api'; // Assuming setAccessToken is exported or handled

const DeepLinkSelector = () => {
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const token = searchParams.get('token');
  const returnUrl = searchParams.get('return_url');
  
  useEffect(() => {
    // In an LTI launch, the backend passes the session token in the URL for this iframe
    if (token) {
      setAccessToken(token);
    }
    
    fetchCourses();
  }, [token]);

  const fetchCourses = async () => {
    try {
      const res = await studentPortalService.getCourseCatalog();
      setCourses(res.data.data || res.data || []);
    } catch (error) {
      console.error('Failed to fetch courses for LTI Selector', error);
      // Fallback data for demo if unauthenticated
      setCourses([
        { id: 'uuid-1', title: 'Advanced Cloud Architecture', description: 'Master AWS and Azure' },
        { id: 'uuid-2', title: 'UI/UX Design Masterclass', description: 'Figma and design principles' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = async (course) => {
    if (!returnUrl) {
      alert("Missing LTI Return URL");
      return;
    }

    setIsSubmitting(course.id);
    try {
      // Ask backend to generate the signed JWT payload
      const res = await ltiService.generateDeepLink({
        return_url: returnUrl,
        course_id: course.id,
        course_title: course.title
      });

      const { jwt, return_url } = res.data;

      // Submit the form back to the LMS to complete the Deep Linking flow
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = return_url;

      const jwtInput = document.createElement('input');
      jwtInput.type = 'hidden';
      jwtInput.name = 'JWT';
      jwtInput.value = jwt;
      
      form.appendChild(jwtInput);
      document.body.appendChild(form);
      form.submit();

    } catch (err) {
      console.error('LTI Deep Link Generation failed', err);
      alert("Failed to generate LTI Link");
      setIsSubmitting(false);
    }
  };

  const filteredCourses = courses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-10 px-4 font-sans text-slate-900">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/30">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Select Ntanda Content</h1>
          <p className="text-slate-500 mt-2">Choose a course or module to embed into your LMS.</p>
        </div>

        <div className="relative mb-6 shadow-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search catalog..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <ul className="divide-y divide-slate-100">
              {filteredCourses.map((course) => (
                <li key={course.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{course.description || 'Interactive Learning Module'}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleSelect(course)}
                    disabled={isSubmitting !== false}
                    className="shrink-0 bg-white border border-slate-200 hover:border-blue-600 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium py-2 px-4 rounded-lg transition-all text-sm flex items-center gap-2"
                  >
                    {isSubmitting === course.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Embed
                      </>
                    )}
                  </button>
                </li>
              ))}
            </ul>
            {filteredCourses.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-sm">
                No courses found matching "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeepLinkSelector;
