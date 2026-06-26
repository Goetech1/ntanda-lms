import { useState, useEffect } from 'react';
import { Trophy, Star, Zap, Award, Sparkles, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { gamificationService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const StudentLeaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUserXp, setCurrentUserXp] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const res = await gamificationService.getLeaderboard();
      setLeaderboard(res.data.leaderboard);
      setCurrentUserXp(res.data.current_user_xp);
    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
      setLeaderboard([]);
      setCurrentUserXp(0);
    } finally {
      setIsLoading(false);
    }
  };

  const getName = (student) => student.full_name || `${student.first_name || ''} ${student.last_name || ''}`.trim() || student.email;
  const getInitials = (student) => getName(student).split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  // Get Top 3
  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  // Rest of the list
  const rest = leaderboard.slice(3);

  // Find current user's rank
  const myRank = leaderboard.findIndex((item) => item.email === user?.email) + 1;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      
      {/* Header with KPI cards */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            <span className="text-yellow-400 font-bold text-sm tracking-widest uppercase">Arena of Knowledge</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Leaderboard</h1>
          <p className="text-slate-400 mt-1">Rise to the top of your class by earning experience points (XP).</p>
        </div>

        {/* User Stats Card */}
        <div className="flex gap-4">
          <Card className="bg-slate-900 border-slate-800 text-white min-w-[150px]">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-400">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Your Rank</p>
                <h4 className="text-xl font-bold">#{myRank > 0 ? myRank : 'N/A'}</h4>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 text-white min-w-[150px]">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center text-[var(--primary)]">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Points</p>
                <h4 className="text-xl font-bold">{currentUserXp ? currentUserXp.toLocaleString() : '0'} XP</h4>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Podium Grid */}
      {leaderboard.length === 0 ? (
        <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-md max-w-4xl mx-auto">
          <CardContent className="p-8 text-center text-slate-400">
            No XP records have been created yet.
          </CardContent>
        </Card>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 items-end max-w-4xl mx-auto">
        
        {/* Second Place (Podium) */}
        {top2 && (
          <div className="flex flex-col items-center order-2 md:order-1 mt-6">
            <div className="relative group flex flex-col items-center">
              <div className="h-20 w-20 rounded-full border-2 border-slate-300 bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-xl overflow-hidden shadow-xl">
                {getInitials(top2)}
              </div>
              <div className="absolute -top-3 bg-slate-300 text-slate-950 font-bold text-xs px-2.5 py-0.5 rounded-full border border-slate-200">
                2nd
              </div>
            </div>
            <h3 className="text-white font-semibold mt-3 text-center break-words max-w-[150px]">
              {getName(top2)}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-1">{top2.total_xp.toLocaleString()} XP</p>
            <div className="w-full h-24 bg-gradient-to-t from-slate-900 to-slate-800/80 border-t border-slate-700/50 rounded-t-xl mt-4 flex items-center justify-center">
              <Award className="h-8 w-8 text-slate-400" />
            </div>
          </div>
        )}

        {/* First Place (Podium) */}
        {top1 && (
          <div className="flex flex-col items-center order-1 md:order-2">
            <div className="relative group flex flex-col items-center">
              <div className="absolute -top-8 text-yellow-400 animate-bounce">
                <Trophy className="h-10 w-10 filter drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]" />
              </div>
              <div className="h-24 w-24 rounded-full border-4 border-yellow-400 bg-slate-800 flex items-center justify-center text-yellow-400 font-extrabold text-2xl overflow-hidden shadow-2xl relative">
                {getInitials(top1)}
              </div>
              <div className="absolute -bottom-2.5 bg-yellow-400 text-slate-950 font-extrabold text-xs px-3.5 py-1 rounded-full border border-yellow-300">
                1st
              </div>
            </div>
            <h3 className="text-white font-bold mt-5 text-lg text-center break-words max-w-[180px]">
              {getName(top1)}
            </h3>
            <p className="text-xs text-yellow-400 font-mono mt-1">{top1.total_xp.toLocaleString()} XP</p>
            <div className="w-full h-32 bg-gradient-to-t from-slate-900 to-[var(--primary)]/30 border-t border-yellow-500/50 rounded-t-2xl mt-4 flex items-center justify-center shadow-[0_-5px_15px_rgba(var(--primary-rgb),0.1)]">
              <Star className="h-10 w-10 text-yellow-400 animate-pulse" />
            </div>
          </div>
        )}

        {/* Third Place (Podium) */}
        {top3 && (
          <div className="flex flex-col items-center order-3 mt-8">
            <div className="relative group flex flex-col items-center">
              <div className="h-16 w-16 rounded-full border-2 border-amber-600 bg-slate-800 flex items-center justify-center text-amber-500 font-bold text-lg overflow-hidden shadow-lg">
                {getInitials(top3)}
              </div>
              <div className="absolute -top-3 bg-amber-600 text-white font-bold text-xs px-2 py-0.5 rounded-full border border-amber-500">
                3rd
              </div>
            </div>
            <h3 className="text-white font-semibold mt-3 text-center break-words max-w-[150px]">
              {getName(top3)}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-1">{top3.total_xp.toLocaleString()} XP</p>
            <div className="w-full h-16 bg-gradient-to-t from-slate-900 to-slate-800/80 border-t border-slate-700/50 rounded-t-xl mt-4 flex items-center justify-center">
              <Award className="h-6 w-6 text-amber-700" />
            </div>
          </div>
        )}

      </div>
      )}

      {/* Leaderboard Table / Remainder of students */}
      <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-md max-w-4xl mx-auto overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-slate-800/60">
            {rest.map((student, idx) => {
              const rank = idx + 4;
              const isMe = student.email === user?.email;
              return (
                <div 
                  key={student.id} 
                  className={`px-6 py-4 flex items-center justify-between gap-4 transition-all ${
                    isMe ? 'bg-[var(--primary)]/10 border-l-4 border-l-[var(--primary)]' : 'hover:bg-slate-800/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-6 font-mono text-slate-400 text-sm font-semibold">{rank}</span>
                    <div className="h-10 w-10 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-300 text-sm font-bold">
                      {getInitials(student)}
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm flex items-center gap-2">
                        {getName(student)}
                        {isMe && <span className="text-[10px] bg-[var(--primary)] text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">You</span>}
                      </h4>
                      <p className="text-xs text-slate-500">{student.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-slate-300 font-mono font-bold text-sm">{student.total_xp.toLocaleString()} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
};

export default StudentLeaderboard;
