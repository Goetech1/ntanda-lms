import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, HelpCircle, Layers, Settings, Loader2, CheckCircle2 } from 'lucide-react';
import { questionBankService } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

const QuestionBank = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Modals / Forms
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (activeCategory) {
      fetchQuestions(activeCategory.id);
    } else {
      fetchQuestions(); // All questions
    }
  }, [activeCategory]);

  const fetchCategories = async () => {
    try {
      const res = await questionBankService.getCategories();
      setCategories(res.data);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch categories', err);
      setIsLoading(false);
    }
  };

  const fetchQuestions = async (categoryId = null) => {
    try {
      const res = await questionBankService.getQuestions(categoryId);
      setQuestions(res.data);
    } catch (err) {
      console.error('Failed to fetch questions', err);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      setIsSaving(true);
      await questionBankService.createCategory({ name: newCategoryName });
      setNewCategoryName('');
      fetchCategories();
    } catch (err) {
      console.error('Failed to create category', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category and detach its questions?')) return;
    try {
      await questionBankService.deleteCategory(id);
      if (activeCategory?.id === id) setActiveCategory(null);
      fetchCategories();
    } catch (err) {
      console.error('Failed to delete category', err);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await questionBankService.deleteQuestion(id);
      fetchQuestions(activeCategory?.id);
    } catch (err) {
      console.error('Failed to delete question', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Question Bank</h1>
          <p className="text-slate-400 mt-1">Manage reusable questions for quizzes and exams.</p>
        </div>
        <Button onClick={() => setShowQuestionForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Question
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: Categories */}
        <div className="space-y-6">
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="pb-4 border-b border-slate-800">
              <CardTitle className="text-lg flex items-center">
                <Layers className="h-5 w-5 mr-2 text-[var(--primary)]" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 border-b border-slate-800">
                <form onSubmit={handleCreateCategory} className="flex gap-2">
                  <Input 
                    placeholder="New category..." 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="h-9"
                  />
                  <Button type="submit" size="sm" isLoading={isSaving}>Add</Button>
                </form>
              </div>
              <ul className="py-2">
                <li 
                  className={`px-4 py-2 cursor-pointer transition-colors ${!activeCategory ? 'bg-[var(--primary)]/10 text-[var(--primary)] font-medium border-r-2 border-[var(--primary)]' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                  onClick={() => setActiveCategory(null)}
                >
                  All Questions
                </li>
                {categories.map(cat => (
                  <li 
                    key={cat.id}
                    className={`px-4 py-2 cursor-pointer transition-colors flex justify-between items-center group ${activeCategory?.id === cat.id ? 'bg-[var(--primary)]/10 text-[var(--primary)] font-medium border-r-2 border-[var(--primary)]' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    <span>{cat.name}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }}
                      className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Main Content: Questions List */}
        <div className="lg:col-span-3">
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="pb-4 border-b border-slate-800">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-[var(--primary)]" />
                  {activeCategory ? `${activeCategory.name} Questions` : 'All Questions'}
                  <span className="ml-3 px-2 py-0.5 rounded-full bg-slate-800 text-xs text-slate-400">
                    {questions.length}
                  </span>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="h-8 w-8 text-[var(--primary)] animate-spin" />
                </div>
              ) : questions.length === 0 ? (
                <div className="p-12 text-center">
                  <HelpCircle className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-300">No questions found</h3>
                  <p className="text-slate-500 mt-1 mb-4">Start building your question bank by adding your first question.</p>
                  <Button onClick={() => setShowQuestionForm(true)}>Add Question</Button>
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {questions.map(q => (
                    <div key={q.id} className="p-4 hover:bg-slate-800/30 transition-colors group">
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider bg-slate-800 text-slate-300">
                              {q.type.replace('_', ' ')}
                            </span>
                            {q.category && (
                              <span className="text-xs text-slate-500 flex items-center">
                                <Layers className="h-3 w-3 mr-1" /> {q.category.name}
                              </span>
                            )}
                          </div>
                          <p className="text-white font-medium line-clamp-2">{q.text}</p>
                          
                          {/* Options Preview */}
                          {q.type === 'multiple_choice' && q.options_json && (
                            <div className="mt-3 grid grid-cols-2 gap-2 max-w-xl">
                              {q.options_json.map((opt, i) => (
                                <div key={i} className={`text-sm px-3 py-1.5 rounded-md border ${q.answer_json?.includes(i.toString()) ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-slate-800 text-slate-400'}`}>
                                  {q.answer_json?.includes(i.toString()) && <CheckCircle2 className="h-3 w-3 inline mr-1.5" />}
                                  {opt}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setEditingQuestion(q)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20" onClick={() => handleDeleteQuestion(q.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* TODO: Add Question Form Modal (Simplified for now) */}
      {showQuestionForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <Card className="w-full max-w-2xl border-slate-800 bg-slate-900 shadow-2xl">
            <CardHeader className="border-b border-slate-800">
              <CardTitle>Create New Question</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-slate-400 mb-6">Question builder interface will go here.</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowQuestionForm(false)}>Cancel</Button>
                <Button>Save Question</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;
