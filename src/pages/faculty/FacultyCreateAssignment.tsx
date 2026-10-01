import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { RubricCriterion } from '../../types';
import { validateMaxMarks } from '../../lib/submissionRules';
import {
  PlusCircle,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Calendar,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const FacultyCreateAssignment: React.FC = () => {
  const { courses, createAssignment, addToast, serverTime } = useApp();
  const navigate = useNavigate();

  const [courseCode, setCourseCode] = useState<string>('CS303');
  const [title, setTitle] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [maxMarks, setMaxMarks] = useState<number>(50);
  const [publishTime, setPublishTime] = useState<string>('2026-10-15T10:00');
  const [deadline, setDeadline] = useState<string>('2026-10-25T23:59');
  const [attachmentName, setAttachmentName] = useState<string>('Assignment_Guidelines.pdf');

  // Rubric criteria state
  const [rubric, setRubric] = useState<RubricCriterion[]>([
    {
      id: 'crit_1',
      title: 'Problem Formulation & Analytical Rigor',
      description: 'Clear statement of system boundaries and problem formulation',
      maxMarks: 20,
    },
    {
      id: 'crit_2',
      title: 'Implementation Correctness & Test Suite',
      description: 'Working code with zero edge case bugs and passing test bench',
      maxMarks: 20,
    },
    {
      id: 'crit_3',
      title: 'Documentation & Presentation',
      description: 'Clean formatting, citations, and diagram legends',
      maxMarks: 10,
    },
  ]);

  const [formError, setFormError] = useState<string | null>(null);

  const rubricTotal = rubric.reduce((acc, c) => acc + (Number(c.maxMarks) || 0), 0);
  const rubricMatchesMax = rubricTotal === Number(maxMarks);

  const handleAddCriterion = () => {
    const newId = 'crit_' + Date.now();
    setRubric((prev) => [
      ...prev,
      {
        id: newId,
        title: 'New Evaluation Criterion',
        description: 'Specify grading expectations for this dimension',
        maxMarks: 5,
      },
    ]);
  };

  const handleRemoveCriterion = (id: string) => {
    if (rubric.length <= 1) {
      addToast('Validation Error', 'Rubric must contain at least 1 criterion.', 'warning');
      return;
    }
    setRubric((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdateCriterion = (id: string, field: keyof RubricCriterion, value: string | number) => {
    setRubric((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Assignment title is mandatory.');
      return;
    }

    if (!instructions.trim()) {
      setFormError('Instructions are mandatory.');
      return;
    }

    const maxValidation = validateMaxMarks(Number(maxMarks));
    if (!maxValidation.valid) {
      setFormError(maxValidation.error || 'Invalid max marks.');
      return;
    }

    if (!rubricMatchesMax) {
      setFormError(
        `Rubric criteria sum (${rubricTotal} pts) does not equal assignment max marks (${maxMarks} pts). Please adjust criteria weights.`
      );
      return;
    }

    const courseObj = courses.find((c) => c.code === courseCode) || courses[0];

    const success = createAssignment({
      courseId: courseObj.id,
      courseCode: courseObj.code,
      courseName: courseObj.name,
      title,
      instructions,
      maxMarks: Number(maxMarks),
      publishedAt: new Date(publishTime).toISOString(),
      deadline: new Date(deadline).toISOString(),
      attachmentName,
      rubric,
    });

    if (success) {
      navigate('/faculty/submissions');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Create New Assignment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Define assignment parameters, publication window, and balanced evaluation rubric
        </p>
      </div>

      <form onSubmit={handlePublish} className="space-y-6">
        {/* Core Assignment Information Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Basic Assignment Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Course Selection *
              </label>
              <select
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
              >
                {courses.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} – {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Max Marks (Whole number 1 to 100) *
              </label>
              <input
                type="number"
                min="1"
                max="100"
                step="1"
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value))}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Assignment Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Lab 4: Memory Management &amp; Paging Simulation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Instructions &amp; Requirements *
            </label>
            <textarea
              rows={4}
              placeholder="Detail the deliverables, permitted file types (PDF/DOCX/ZIP under 10MB), and core objectives..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Publish Time (IST)
              </label>
              <input
                type="datetime-local"
                value={publishTime}
                onChange={(e) => setPublishTime(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Deadline D (Hard Cutoff IST) *
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Rubric Builder Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                Rubric Builder
              </h2>
              <p className="text-xs text-slate-500">
                Total marks must match Max Marks ({maxMarks} pts) exactly.
              </p>
            </div>

            {/* Live Sum Indicator */}
            <div
              className={`px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                rubricMatchesMax
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-rose-50 text-rose-800 border-rose-300 animate-pulse'
              }`}
            >
              {rubricMatchesMax ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Rubric Sum: {rubricTotal} / {maxMarks} pts (Matched ✓)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>
                    Rubric Sum: {rubricTotal} / {maxMarks} pts (Mismatch: Δ{' '}
                    {Math.abs(rubricTotal - maxMarks)})
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Criteria List */}
          <div className="space-y-3">
            {rubric.map((crit, idx) => (
              <div
                key={crit.id}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                    <input
                      type="text"
                      value={crit.title}
                      onChange={(e) => handleUpdateCriterion(crit.id, 'title', e.target.value)}
                      placeholder="Criterion title"
                      className="text-xs font-bold bg-white border border-slate-300 rounded px-2.5 py-1.5 flex-1"
                    />
                  </div>
                  <input
                    type="text"
                    value={crit.description}
                    onChange={(e) => handleUpdateCriterion(crit.id, 'description', e.target.value)}
                    placeholder="Evaluation guidance and marks standard"
                    className="text-xs text-slate-600 bg-white border border-slate-300 rounded px-2.5 py-1.5 w-full"
                  />
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block">
                      Marks
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={maxMarks}
                      value={crit.maxMarks}
                      onChange={(e) =>
                        handleUpdateCriterion(crit.id, 'maxMarks', Number(e.target.value))
                      }
                      className="w-20 text-xs font-bold bg-white border border-slate-300 rounded p-1.5 text-right"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveCriterion(crit.id)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors mt-3"
                    title="Remove criterion"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddCriterion}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 py-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Rubric Criterion</span>
          </button>
        </div>

        {/* Form Error Banner */}
        {formError && (
          <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigate('/faculty')}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!rubricMatchesMax}
            className="px-6 py-2.5 bg-[#1F3864] hover:bg-[#152644] disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Publish Assignment</span>
          </button>
        </div>
      </form>
    </div>
  );
};
