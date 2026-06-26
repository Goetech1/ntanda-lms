import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { ChevronLeft, Download, Search, CheckCircle, XCircle, Clock } from 'lucide-react';

const Gradebook = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGradebook = async () => {
      try {
        const response = await api.get(`/courses/${courseId}/gradebook`);
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch gradebook:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGradebook();
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-64 mb-8" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!data) return <div className="p-8 text-center text-slate-500">Failed to load gradebook data.</div>;

  const filteredStudents = data.students.filter(student => 
    student.user_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'GRADED': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'PENDING': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'RETURNED': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4 rounded-full border-2 border-slate-300 border-dashed" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 lg:p-12 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate(`/instructor/courses/${courseId}`)} className="text-slate-600 mb-2 hover:bg-white">
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to Course
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Gradebook</h1>
          <p className="text-slate-600 mt-1">{data.course_title}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search students..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all"
            />
          </div>
          <Button variant="outline" className="border-slate-200 text-slate-700 hover:text-white">
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="bg-white/50 border border-slate-200 rounded-xl overflow-x-auto shadow-2xl">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white/80 border-b border-slate-200 text-slate-600 font-medium">
            <tr>
              <th className="px-6 py-4 sticky left-0 bg-white/95 z-10 w-64 min-w-[16rem]">Student</th>
              <th className="px-6 py-4 border-r border-slate-200/50 text-center w-32">Progress</th>
              {data.assessments.map(assessment => (
                <th key={assessment.id} className="px-6 py-4 border-r border-slate-200/50 text-center min-w-[140px]">
                  <div className="truncate" title={assessment.title}>{assessment.title}</div>
                  <div className="text-xs text-slate-600 font-normal mt-0.5">{assessment.type} • {assessment.total_points} pts</div>
                </th>
              ))}
              <th className="px-6 py-4 text-center w-32">Final Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => {
                let totalPossible = 0;
                let totalEarned = 0;
                
                return (
                  <tr key={student.user_id} className="hover:bg-slate-100/30 transition-colors group">
                    <td className="px-6 py-4 sticky left-0 bg-slate-50 group-hover:bg-white/80 transition-colors z-10 border-r border-slate-200/20">
                      <div className="font-medium text-slate-800">{student.user_name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{student.user_email}</div>
                    </td>
                    <td className="px-6 py-4 border-r border-slate-200/50">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[var(--primary)] rounded-full" 
                            style={{ width: `${student.progress_percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600 w-8">{student.progress_percentage}%</span>
                      </div>
                    </td>
                    {data.assessments.map(assessment => {
                      const grade = student.grades[assessment.id];
                      if (grade?.score !== null && grade?.score !== undefined) {
                        totalPossible += grade.total_points;
                        totalEarned += grade.score;
                      }
                      
                      return (
                        <td key={assessment.id} className="px-6 py-4 border-r border-slate-200/50 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {getStatusIcon(grade?.status)}
                            {grade?.score !== null ? (
                              <span className="font-medium text-slate-700">
                                {grade.score} <span className="text-slate-600 text-xs">/ {grade.total_points}</span>
                              </span>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 text-center font-semibold text-white bg-white/30">
                      {totalPossible > 0 ? `${Math.round((totalEarned / totalPossible) * 100)}%` : '-'}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={data.assessments.length + 3} className="px-6 py-12 text-center text-slate-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Gradebook;
