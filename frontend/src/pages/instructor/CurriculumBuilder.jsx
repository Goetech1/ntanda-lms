import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { courseService } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { GripVertical, Plus, Video, FileText, ChevronLeft, Save } from 'lucide-react';
import api from '../../services/api'; // fallback for direct calls

// --- Sortable Item Component for Lessons ---
const SortableLesson = ({ lesson, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 bg-white border border-slate-200 p-3 rounded-lg mb-2 group">
      <div {...attributes} {...listeners} className="cursor-grab p-1 text-slate-500 hover:text-slate-700 active:cursor-grabbing">
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="h-8 w-8 rounded bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shrink-0">
        {lesson.media_type === 'YOUTUBE' || lesson.media_type === 'VIMEO' ? <Video className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-slate-800 truncate">{lesson.title}</h4>
        <p className="text-xs text-slate-500">{lesson.media_type || 'TEXT'}</p>
      </div>
    </div>
  );
};

// --- Sortable Module Component ---
const SortableModule = ({ module, index, activeModuleId, setActiveModuleId, onLessonsReordered }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleLessonDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = module.lessons.findIndex(l => l.id === active.id);
      const newIndex = module.lessons.findIndex(l => l.id === over.id);
      const newLessons = arrayMove(module.lessons, oldIndex, newIndex);
      onLessonsReordered(module.id, newLessons);
    }
  };

  return (
    <Card ref={setNodeRef} style={style} className={`mb-6 border-slate-200 transition-colors ${isDragging ? 'opacity-50 ring-2 ring-[var(--primary)]' : ''} ${activeModuleId === module.id ? 'ring-1 ring-slate-700' : ''}`}>
      <CardHeader className="bg-white/50 p-4 border-b border-slate-200/60 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div {...attributes} {...listeners} className="cursor-grab p-1 text-slate-500 hover:text-slate-700 active:cursor-grabbing">
            <GripVertical className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Module {index + 1}: {module.title}</CardTitle>
            <p className="text-xs text-slate-500 mt-1">{module.lessons?.length || 0} lessons</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setActiveModuleId(module.id)}>
          Edit
        </Button>
      </CardHeader>
      <CardContent className="p-4 bg-slate-50/50">
        {module.lessons && module.lessons.length > 0 ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleLessonDragEnd}>
            <SortableContext items={module.lessons.map(l => l.id)} strategy={verticalListSortingStrategy}>
              {module.lessons.map((lesson, idx) => (
                <SortableLesson key={lesson.id} lesson={lesson} index={idx} />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center p-4 border border-dashed border-slate-200 rounded-lg text-slate-500 text-sm">
            No lessons in this module.
          </div>
        )}
        <div className="mt-4 flex justify-center">
          <Button variant="ghost" size="sm" className="text-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10">
            <Plus className="h-4 w-4 mr-2" />
            Add Lesson
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Main Builder Component ---
const CurriculumBuilder = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const response = await courseService.getCourseById(courseId);
        setCourse(response.data?.data || response.data);
        // Assuming course payload includes nested modules -> lessons
        // If not, we would need to fetch them separately. We'll assume the API returns nested for simplicity.
        const sortedModules = (response.data?.data?.modules || response.data?.modules || []).sort((a,b) => a.order_index - b.order_index);
        sortedModules.forEach(m => {
           if(m.lessons) m.lessons.sort((a,b) => a.order_index - b.order_index);
        });
        setModules(sortedModules);
      } catch (error) {
        console.error("Failed to fetch curriculum:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurriculum();
  }, [courseId]);

  const handleModuleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = modules.findIndex(m => m.id === active.id);
      const newIndex = modules.findIndex(m => m.id === over.id);
      const newModules = arrayMove(modules, oldIndex, newIndex);
      // update order indexes locally
      const updatedModules = newModules.map((m, idx) => ({ ...m, order_index: idx }));
      setModules(updatedModules);
    }
  };

  const handleLessonsReordered = (moduleId, newLessons) => {
    const updatedLessons = newLessons.map((l, idx) => ({ ...l, order_index: idx }));
    setModules(modules.map(m => m.id === moduleId ? { ...m, lessons: updatedLessons } : m));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // Send bulk reorder request for modules
      await api.post(`/courses/${courseId}/modules/reorder`, {
        modules: modules.map(m => ({ id: m.id, order_index: m.order_index }))
      });

      // Send bulk reorder request for lessons in each module
      for (const mod of modules) {
        if (mod.lessons && mod.lessons.length > 0) {
          await api.post(`/course-modules/${mod.id}/lessons/reorder`, {
            lessons: mod.lessons.map(l => ({ id: l.id, order_index: l.order_index }))
          });
        }
      }
      // Success feedback could go here
    } catch (error) {
      console.error("Failed to save order:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-10 w-64 mb-8" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 lg:p-12 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate(`/instructor/courses/${courseId}`)} className="text-slate-600 mb-2 hover:bg-white">
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to Course
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Curriculum Builder</h1>
          <p className="text-slate-600 mt-1">Drag and drop to reorder modules and lessons for "{course?.title}"</p>
        </div>
        <Button onClick={handleSaveChanges} isLoading={isSaving} className="shadow-lg shadow-[var(--primary)]/20">
          <Save className="h-4 w-4 mr-2" />
          Save Order
        </Button>
      </div>

      <div className="flex gap-8">
        {/* Left Column: Drag and Drop Area */}
        <div className="flex-1">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleModuleDragEnd}>
            <SortableContext items={modules.map(m => m.id)} strategy={verticalListSortingStrategy}>
              {modules.map((module, index) => (
                <SortableModule 
                  key={module.id} 
                  module={module} 
                  index={index} 
                  activeModuleId={activeModuleId}
                  setActiveModuleId={setActiveModuleId}
                  onLessonsReordered={handleLessonsReordered}
                />
              ))}
            </SortableContext>
          </DndContext>
          
          <Button variant="outline" className="w-full h-14 border-dashed border-slate-300 text-slate-600 hover:text-white hover:border-slate-500">
            <Plus className="h-5 w-5 mr-2" />
            Add New Module
          </Button>
        </div>

        {/* Right Column: Settings / Inspector (Placeholder) */}
        <div className="w-80 shrink-0 hidden lg:block">
          <Card className="sticky top-6 border-slate-200 bg-white/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">Item Settings</CardTitle>
            </CardHeader>
            <CardContent>
              {activeModuleId ? (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">Editing Module</p>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Title</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-sm text-white" defaultValue={modules.find(m => m.id === activeModuleId)?.title} />
                  </div>
                  <Button className="w-full mt-4">Update Details</Button>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-sm">
                  Select a module or lesson to edit its settings, add rich media, or upload attachments.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CurriculumBuilder;
