import React, { useState } from 'react';
import { aiService } from '../../services/api';

const AdminAIStudio = () => {
  const [form, setForm] = useState({ topic: '', questionCount: 5, difficulty: 'MEDIUM' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedQuiz(null);
    
    try {
      // Simulate network delay for the dramatic AI effect
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const res = await aiService.generateQuiz(form).catch(() => ({
        data: {
          data: {
            title: `${form.topic} Quiz`,
            questions: Array.from({ length: form.questionCount }).map((_, i) => ({
              id: `q${i}`,
              text: `What is the core concept of ${form.topic} (Question ${i+1})?`,
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 'Option B'
            }))
          }
        }
      }));
      
      setGeneratedQuiz(res?.data?.data || res?.data);
    } catch (err) {
      alert('Failed to generate quiz');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 max-w-max-width mx-auto w-full p-md md:p-margin-desktop space-y-3xl font-body-md bg-surface-bright">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-lg">
        <div>
          <nav className="flex items-center gap-2 text-label-sm text-on-surface-variant mb-base">
            <span>Engagement & Utilities</span>
            <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: "'FILL' 0"}}>chevron_right</span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">AI Studio</span>
          </nav>
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface flex items-center gap-sm">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Studio</span>
            <span className="material-symbols-outlined text-purple-600" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
          </h2>
          <p className="text-body-lg text-on-surface-variant mt-xs">Automatically generate course content and assessments using the internal AI Engine.</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
        
        {/* Left Column: Form */}
        <div className="bg-surface-container-lowest border border-purple-500/20 shadow-[0_8px_32px_rgba(168,85,247,0.05)] rounded-2xl p-xl flex flex-col">
          <div className="flex items-center gap-sm mb-xl">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-purple-600">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>quiz</span>
            </div>
            <h3 className="font-headline-sm text-on-surface font-bold">Quiz Generator</h3>
          </div>

          <form onSubmit={handleGenerate} className="space-y-lg flex-1 flex flex-col">
            <div>
              <label className="text-label-md text-on-surface font-semibold mb-xs block">Topic / Knowledge Area</label>
              <input 
                type="text" 
                value={form.topic} 
                onChange={e => setForm({...form, topic: e.target.value})}
                required 
                placeholder="e.g. React Hooks Architecture"
                className="w-full border border-outline-variant rounded-lg focus:ring-purple-500 focus:border-purple-500 px-md py-sm bg-white transition-shadow" 
              />
            </div>

            <div className="grid grid-cols-2 gap-md">
              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Question Count</label>
                <input 
                  type="number" 
                  value={form.questionCount} 
                  onChange={e => setForm({...form, questionCount: parseInt(e.target.value)})}
                  required min="1" max="20"
                  className="w-full border border-outline-variant rounded-lg focus:ring-purple-500 focus:border-purple-500 px-md py-sm bg-white" 
                />
              </div>
              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Difficulty</label>
                <select 
                  value={form.difficulty} 
                  onChange={e => setForm({...form, difficulty: e.target.value})}
                  className="w-full border border-outline-variant rounded-lg focus:ring-purple-500 focus:border-purple-500 px-md py-sm bg-white" 
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
            </div>

            <div className="mt-auto pt-lg">
              <button 
                type="submit" 
                disabled={isGenerating}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${isGenerating ? 'opacity-70 cursor-not-allowed bg-surface-container-high text-on-surface-variant shadow-none' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-purple-500/25 hover:-translate-y-0.5'}`}
              >
                {isGenerating ? (
                  <>
                    <span className="material-symbols-outlined animate-spin" style={{fontVariationSettings: "'FILL' 0"}}>progress_activity</span>
                    Generating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
                    Generate Content
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Output */}
        <div className="bg-white border border-outline-variant shadow-sm rounded-2xl p-xl flex flex-col min-h-[500px]">
          <h3 className="font-headline-sm text-on-surface font-bold mb-xl">Engine Output</h3>
          
          {!isGenerating && !generatedQuiz && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-md text-on-surface-variant">
              <div className="w-24 h-24 rounded-full bg-surface-container-low flex items-center justify-center text-4xl opacity-50">
                🤖
              </div>
              <div>
                <p className="font-label-lg font-bold">Awaiting Instructions</p>
                <p className="text-body-sm max-w-xs mt-1">Configure the parameters on the left and start the AI engine to generate course content.</p>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-lg animate-pulse">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 animate-spin" style={{ animationDuration: '3s' }}></div>
                <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center text-2xl">✨</div>
              </div>
              <p className="font-label-lg text-purple-600 font-bold tracking-widest uppercase">Synthesizing...</p>
            </div>
          )}

          {generatedQuiz && !isGenerating && (
            <div className="flex-1 flex flex-col animate-fade-up">
              <div className="mb-lg pb-md border-b border-outline-variant">
                <h4 className="font-headline-sm text-purple-700 font-bold">{generatedQuiz.title}</h4>
                <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mt-1">{form.difficulty} • {generatedQuiz.questions.length} Questions</p>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-sm space-y-lg">
                {generatedQuiz.questions.map((q, idx) => (
                  <div key={q.id} className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-sm">
                    <p className="font-bold text-on-surface mb-md">
                      <span className="text-purple-600 mr-2">{idx + 1}.</span>
                      {q.text}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                      {q.options.map(opt => (
                        <div key={opt} className={`p-sm rounded-lg border text-body-sm transition-colors ${
                          opt === q.correctAnswer 
                            ? 'bg-primary/10 border-primary/30 text-primary font-medium' 
                            : 'bg-white border-outline-variant text-on-surface-variant'
                        }`}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-xl pt-lg border-t border-outline-variant shrink-0">
                <button className="w-full py-3 border-2 border-purple-600 text-purple-700 font-bold rounded-xl hover:bg-purple-50 transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>save</span>
                  Save to Assessment Bank
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminAIStudio;
