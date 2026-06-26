import { useState } from 'react';
import { Star, MessageSquare, Send, CheckCircle2, UserCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

const PeerReview = ({ assignmentId, reviewee, submission, onComplete }) => {
  const [score, setScore] = useState(0);
  const [hoveredScore, setHoveredScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (score === 0 || !feedback.trim()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onComplete({ score, feedback });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Peer Review</h2>
          <p className="text-slate-400 mt-1">Evaluate your peer's assignment submission objectively.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Submission Content */}
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm h-full">
          <CardHeader className="border-b border-slate-800 bg-slate-900/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                <UserCircle2 className="h-6 w-6 text-slate-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Peer Submission</CardTitle>
                <p className="text-sm text-slate-500">Anonymous Student</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="prose prose-invert max-w-none">
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 min-h-[300px]">
                {submission?.text ? (
                  <p className="whitespace-pre-wrap text-slate-300 leading-relaxed">{submission.text}</p>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-3">
                    <MessageSquare className="h-8 w-8" />
                    <p>No text submission provided.</p>
                  </div>
                )}
                
                {submission?.attachment && (
                  <div className="mt-6 pt-6 border-t border-slate-800">
                    <h4 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Attachment</h4>
                    <a 
                      href={submission.attachment} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700 text-sm"
                    >
                      View Submitted File
                    </a>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Evaluation Form */}
        <Card className="border-slate-800 bg-slate-900 shadow-2xl h-full">
          <CardHeader className="border-b border-slate-800 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[var(--primary)]" />
              Your Evaluation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8 flex flex-col h-full">
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-300 block mb-3 uppercase tracking-wider">
                    Overall Score
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setScore(star)}
                        onMouseEnter={() => setHoveredScore(star)}
                        onMouseLeave={() => setHoveredScore(0)}
                        className={`p-2 transition-all duration-200 ${
                          (hoveredScore || score) >= star 
                            ? 'text-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' 
                            : 'text-slate-700 hover:text-slate-500 hover:scale-110'
                        }`}
                      >
                        <Star className="h-10 w-10" fill={(hoveredScore || score) >= star ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {score === 0 ? 'Select a star rating to score this submission.' : `You rated this ${score} out of 5.`}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <label className="text-sm font-semibold text-slate-300 block uppercase tracking-wider">
                    Constructive Feedback
                  </label>
                  <p className="text-xs text-slate-500">Provide specific, actionable feedback to help your peer improve.</p>
                  <textarea
                    required
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="e.g. Your arguments are well structured, but the conclusion could be stronger by..."
                    className="w-full min-h-[200px] bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-300 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] resize-none"
                  />
                </div>
              </div>

              <div className="mt-auto pt-6">
                <Button 
                  type="submit" 
                  disabled={score === 0 || !feedback.trim()} 
                  isLoading={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"
                >
                  <Send className="h-4 w-4 mr-2" /> Submit Review
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PeerReview;
