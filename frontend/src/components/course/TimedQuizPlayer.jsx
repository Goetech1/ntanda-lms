import { useState, useEffect, useCallback } from 'react';
import { Clock, WifiOff, Wifi, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

const TimedQuizPlayer = ({ quizId, questions = [], timeLimitMinutes, onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [hasUnsyncedChanges, setHasUnsyncedChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state with localStorage for offline resilience
  const STORAGE_KEY = `quiz_${quizId}_progress`;

  useEffect(() => {
    // Load from cache on mount
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      setAnswers(parsed.answers || {});
      if (parsed.timeLeft) setTimeLeft(parsed.timeLeft);
    }
  }, [quizId]);

  // Network Status Listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      if (hasUnsyncedChanges) {
        syncToServer();
      }
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [hasUnsyncedChanges]);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        // Periodically cache time
        if (newTime % 5 === 0) saveToLocal(answers, newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const saveToLocal = (newAnswers, currentTime) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      answers: newAnswers,
      timeLeft: currentTime
    }));
    setHasUnsyncedChanges(true);
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    const newAnswers = {
      ...answers,
      [questionId]: optionIndex
    };
    setAnswers(newAnswers);
    saveToLocal(newAnswers, timeLeft);
  };

  const syncToServer = async () => {
    // Simulate background sync
    try {
      // await api.post(`/quizzes/${quizId}/sync`, { answers, timeLeft });
      setHasUnsyncedChanges(false);
      console.log('Background sync successful');
    } catch (err) {
      console.error('Failed to background sync', err);
    }
  };

  const handleTimeUp = useCallback(() => {
    submitQuiz(true);
  }, [answers]);

  const submitQuiz = async (autoSubmitted = false) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      localStorage.removeItem(STORAGE_KEY);
      onComplete(answers, autoSubmitted);
      setIsSubmitting(false);
    }, 1000);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isWarningTime = timeLeft < 60; // Less than 1 minute

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Quiz Header - Sticky */}
      <div className="sticky top-0 z-10 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-lg font-bold transition-colors ${
            isWarningTime ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-slate-800 text-slate-200'
          }`}>
            <Clock className="h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
          
          <div className="hidden sm:flex items-center">
            {isOffline ? (
              <span className="flex items-center text-amber-500 text-sm bg-amber-500/10 px-3 py-1 rounded-full">
                <WifiOff className="h-4 w-4 mr-2" /> Offline - Saving locally
              </span>
            ) : hasUnsyncedChanges ? (
              <span className="flex items-center text-blue-400 text-sm">
                <div className="h-2 w-2 bg-blue-400 rounded-full animate-ping mr-2"></div>
                Syncing...
              </span>
            ) : (
              <span className="flex items-center text-emerald-400 text-sm">
                <CheckCircle2 className="h-4 w-4 mr-2" /> Synced
              </span>
            )}
          </div>
        </div>

        <Button 
          onClick={() => submitQuiz(false)} 
          isLoading={isSubmitting}
          className="bg-[var(--primary)] hover:bg-[var(--primary)]/90"
        >
          Submit Quiz
        </Button>
      </div>

      {isOffline && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-lg flex items-start">
          <AlertTriangle className="h-5 w-5 mr-3 shrink-0 mt-0.5" />
          <p className="text-sm">
            <strong>You are offline.</strong> Don't panic! Your answers are being securely saved to your browser. 
            Do not clear your browser cache. The quiz will automatically sync when your connection is restored.
          </p>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((q, index) => (
          <div key={q.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">
              <span className="text-slate-500 mr-2">{index + 1}.</span> 
              {q.text}
            </h3>
            
            <div className="space-y-3">
              {q.options?.map((opt, optIdx) => {
                const isSelected = answers[q.id] === optIdx;
                return (
                  <label 
                    key={optIdx} 
                    className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)]' 
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name={`question_${q.id}`} 
                      className="hidden" 
                      checked={isSelected}
                      onChange={() => handleAnswerSelect(q.id, optIdx)}
                    />
                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-4 shrink-0 transition-colors ${
                      isSelected ? 'border-[var(--primary)]' : 'border-slate-600'
                    }`}>
                      {isSelected && <div className="h-2.5 w-2.5 bg-[var(--primary)] rounded-full"></div>}
                    </div>
                    <span className={isSelected ? 'font-medium' : ''}>{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimedQuizPlayer;
