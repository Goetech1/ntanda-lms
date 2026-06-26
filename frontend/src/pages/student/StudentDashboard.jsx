import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentPortalService } from '../../services/api';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myCourses = await studentPortalService.getMyEnrollments().catch(() => ({
          data: { data: [
            { id: '1', course: { id: 'c1', title: 'Data Science & Machine Learning', module: 'Module 4: Advanced Algorithms', thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqByl-I24mDf2Yazv3FY0yJnT06YC5NseqBKYTTN5p-2wTtOQXTEWys7eWBQElGBfqqxkwp5kKdNigqRGf6_VoVwCdCGZ4TrLCW6xpUQARMBN-uh6a2dM2B3WYhG_RvFXE_ujkKGFL73T1RbRENN9bisECIo_AkVvU4T6XxlDY8vaEbf8XYlLyxRsu1rlAopur7LptROgLsp5FB-i59IbSbfdP4Ld4AywOowKfDH-xzUsx10x1FX744K8c95jIHZ3HdnH1OJ0C-WY' }, progress: 68, lastAccessed: 'Neural Network Architectures and Backpropagation fundamentals. Next quiz scheduled for Friday.' }
          ]}
        }));

        setEnrollments(myCourses?.data?.data || myCourses?.data || []);
      } catch (err) {
        console.error('Error fetching student dashboard', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div className="p-xl text-center text-primary font-bold">Loading your learning hub...</div>;

  const lastActive = enrollments[0];

  return (
    <main className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-xl pb-32 animate-fade-up">
      {/* Welcome Greeting */}
      <section className="mb-3xl">
        <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background">
          Welcome back, <span className="text-primary">Alex</span>.
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-xs">You've completed 12% of your weekly goal. Keep the momentum going!</p>
      </section>

      {/* Bento Grid Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-3xl">
        {/* Overall Progress Card */}
        <div className="md:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-[0_4px_16px_rgba(0,83,219,0.05)]">
          <div className="flex justify-between items-start mb-xl">
            <div>
              <span className="font-label-md text-label-md text-tertiary bg-tertiary/10 px-sm py-xs rounded mb-sm inline-block">ACADEMIC OVERVIEW</span>
              <h3 className="font-headline-md text-headline-md text-on-background">Semester Performance</h3>
            </div>
            <div className="text-right">
              <span className="font-headline-md text-headline-md text-primary">3.8 GPA</span>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Current Average</p>
            </div>
          </div>
          <div className="h-48 w-full flex items-end justify-between gap-sm pt-md">
            {/* Simple bar chart visualization */}
            <div className="flex-1 bg-primary/10 rounded-t-lg relative group transition-all duration-300 hover:bg-primary/20 h-[65%]">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-label-sm text-label-sm opacity-0 group-hover:opacity-100 transition-opacity">Mon</div>
            </div>
            <div className="flex-1 bg-primary/10 rounded-t-lg relative group transition-all duration-300 hover:bg-primary/20 h-[40%]">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-label-sm text-label-sm opacity-0 group-hover:opacity-100 transition-opacity">Tue</div>
            </div>
            <div className="flex-1 bg-primary rounded-t-lg relative group transition-all duration-300 h-[85%]">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-label-sm text-label-sm opacity-100">Wed</div>
            </div>
            <div className="flex-1 bg-primary/10 rounded-t-lg relative group transition-all duration-300 hover:bg-primary/20 h-[55%]">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-label-sm text-label-sm opacity-0 group-hover:opacity-100 transition-opacity">Thu</div>
            </div>
            <div className="flex-1 bg-primary/10 rounded-t-lg relative group transition-all duration-300 hover:bg-primary/20 h-[70%]">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-label-sm text-label-sm opacity-0 group-hover:opacity-100 transition-opacity">Fri</div>
            </div>
          </div>
        </div>

        {/* Quick Stats Column */}
        <div className="md:col-span-4 flex flex-col gap-gutter">
          <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col justify-center">
            <div className="flex items-center gap-md mb-sm">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>schedule</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant">STUDY HOURS</span>
            </div>
            <div className="font-headline-md text-headline-md">24.5 hrs</div>
            <p className="font-label-sm text-label-sm text-primary">+2.4h from last week</p>
          </div>
          <div className="flex-1 bg-secondary/5 border border-secondary/10 rounded-xl p-md flex flex-col justify-center">
            <div className="flex items-center gap-md mb-sm">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>assignment_turned_in</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant">ASSIGNMENTS</span>
            </div>
            <div className="font-headline-md text-headline-md text-secondary">8 / 10</div>
            <p className="font-label-sm text-label-sm text-secondary-container">2 Pending this week</p>
          </div>
        </div>
      </div>

      {/* Continue Learning Section */}
      {lastActive && (
        <section className="mb-3xl">
          <div className="flex justify-between items-center mb-lg">
            <h3 className="font-headline-md text-headline-md text-on-background">Continue Learning</h3>
            <button onClick={() => navigate('/student/my-courses')} className="text-primary font-label-md text-label-md flex items-center gap-xs hover:underline">
              View Schedule <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 0"}}>arrow_forward</span>
            </button>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden group flex flex-col md:flex-row cursor-pointer" onClick={() => navigate(`/student/player/${lastActive.course.id}`)}>
            <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={lastActive.course.thumbnail} alt="Course Thumbnail" />
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
            </div>
            <div className="flex-1 p-xl">
              <div className="flex justify-between items-start mb-md">
                <div>
                  <span className="text-primary font-label-sm text-label-sm border border-primary/20 px-sm py-1 rounded">{lastActive.course.module || 'Current Module'}</span>
                  <h4 className="font-headline-md text-headline-md mt-sm">{lastActive.course.title}</h4>
                </div>
                <div className="p-2 bg-primary text-on-primary rounded-lg active:scale-95 transition-all">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>play_arrow</span>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mb-xl max-w-2xl">Currently studying: {lastActive.lastAccessed}</p>
              
              <div className="space-y-sm">
                <div className="flex justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface-variant">Course Progress</span>
                  <span className="text-primary font-bold">{lastActive.progress}%</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${lastActive.progress}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Deadlines */}
      <section>
        <h3 className="font-headline-md text-headline-md text-on-background mb-lg">Upcoming Milestones</h3>
        <div className="space-y-md">
          <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-lg flex items-center gap-lg hover:border-primary transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-surface-container rounded-lg flex flex-col items-center justify-center border border-outline-variant shrink-0 group-hover:bg-primary-fixed transition-colors">
              <span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-primary">OCT</span>
              <span className="font-headline-sm text-headline-sm leading-none">24</span>
            </div>
            <div className="flex-1">
              <h5 className="font-body-md text-body-md font-bold">Research Thesis Draft Submission</h5>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Environmental Economics (ECON-402)</p>
            </div>
            <div className="hidden md:flex gap-sm">
              <span className="font-label-sm text-label-sm bg-error-container text-on-error-container px-sm py-1 rounded">High Priority</span>
              <span className="font-label-sm text-label-sm bg-surface-container-high px-sm py-1 rounded">File Upload</span>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-lg flex items-center gap-lg hover:border-primary transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-surface-container rounded-lg flex flex-col items-center justify-center border border-outline-variant shrink-0 group-hover:bg-primary-fixed transition-colors">
              <span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-primary">OCT</span>
              <span className="font-headline-sm text-headline-sm leading-none">27</span>
            </div>
            <div className="flex-1">
              <h5 className="font-body-md text-body-md font-bold">Midterm Group Presentation</h5>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Human Computer Interaction (CS-310)</p>
            </div>
            <div className="hidden md:flex gap-sm">
              <span className="font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed px-sm py-1 rounded">Group Work</span>
              <span className="font-label-sm text-label-sm bg-surface-container-high px-sm py-1 rounded">Lab Room 3B</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default StudentDashboard;
