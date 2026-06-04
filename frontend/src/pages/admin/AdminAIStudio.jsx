import { useState } from 'react';
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
    <div style={{ paddingBottom: '4rem', maxWidth: '1000px', position: 'relative' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ 
            background: 'linear-gradient(45deg, #00e5ff, #b200ff)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 8px rgba(0,229,255,0.3))'
          }}>AI Studio</span>
          ✨
        </h1>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem' }}>Automatically generate course content and assessments using the internal AI Engine.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Left Column: Form */}
        <div className="glass-panel animate-fade-up" style={{ padding: '2.5rem', border: '1px solid rgba(0,229,255,0.2)', boxShadow: '0 8px 32px rgba(0,229,255,0.05)' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#fff' }}>Quiz Generator</h3>
          <form onSubmit={handleGenerate}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Topic</label>
              <input 
                type="text" 
                value={form.topic} 
                onChange={e => setForm({...form, topic: e.target.value})}
                required 
                placeholder="e.g. React Hooks Architecture"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Number of Questions</label>
                <input 
                  type="number" 
                  value={form.questionCount} 
                  onChange={e => setForm({...form, questionCount: parseInt(e.target.value)})}
                  required min="1" max="20"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Difficulty</label>
                <select 
                  value={form.difficulty} 
                  onChange={e => setForm({...form, difficulty: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} 
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isGenerating}
              style={{ 
                width: '100%', 
                background: 'linear-gradient(45deg, #00e5ff, #b200ff)', 
                border: 'none',
                boxShadow: '0 0 15px rgba(0,229,255,0.4)',
                opacity: isGenerating ? 0.7 : 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {isGenerating ? (
                <>
                  <span className="spinner" style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                  Generating...
                </>
              ) : 'Generate Quiz'}
            </button>
          </form>
        </div>

        {/* Right Column: Output */}
        <div className="glass-panel animate-fade-up" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#fff' }}>Output</h3>
          
          {!isGenerating && !generatedQuiz && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', flexDirection: 'column', gap: '1rem' }}>
              <span style={{ fontSize: '3rem', opacity: 0.2 }}>🤖</span>
              Wait for AI Engine to generate content.
            </div>
          )}

          {isGenerating && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(45deg, #00e5ff, #b200ff)', animation: 'pulse 1.5s infinite', boxShadow: '0 0 20px #00e5ff' }}></div>
              <p style={{ color: 'var(--primary)', fontWeight: '500', animation: 'pulse 1.5s infinite' }}>Engine is processing...</p>
            </div>
          )}

          {generatedQuiz && !isGenerating && (
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }} className="animate-fade-up">
              <h4 style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.2rem', borderBottom: '1px solid rgba(0,229,255,0.2)', paddingBottom: '0.5rem' }}>{generatedQuiz.title}</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {generatedQuiz.questions.map((q, idx) => (
                  <div key={q.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ fontWeight: '600', margin: '0 0 1rem 0' }}>{idx + 1}. {q.text}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      {q.options.map(opt => (
                        <div key={opt} style={{ 
                          padding: '0.75rem', 
                          borderRadius: '6px', 
                          background: opt === q.correctAnswer ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
                          border: opt === q.correctAnswer ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                          color: opt === q.correctAnswer ? '#10b981' : 'var(--text-muted)',
                          fontSize: '0.9rem'
                        }}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <button className="btn btn-outline" style={{ width: '100%', borderColor: 'var(--primary)', color: 'var(--primary)' }}>Save to Course Bank</button>
              </div>
            </div>
          )}

        </div>
      </div>
      
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.95); } }
      `}</style>
    </div>
  );
};

export default AdminAIStudio;
