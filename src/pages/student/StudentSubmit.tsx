import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  evaluateSubmissionStatus,
  formatIST,
  validateUploadFile,
  MAX_FILE_SIZE_BYTES,
  ALLOWED_EXTENSIONS,
} from '../../lib/submissionRules';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  History,
  Mail,
  ShieldCheck,
  FileCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const StudentSubmit: React.FC = () => {
  const [searchParams] = useSearchParams();
  const requestedAsgId = searchParams.get('asg') || 'asg_se_01';

  const {
    assignments,
    submissions,
    serverTime,
    activePreset,
    user,
    submitStudentFile,
  } = useApp();

  const [selectedAsgId, setSelectedAsgId] = useState<string>(requestedAsgId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [recentReceipt, setRecentReceipt] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentAssignment =
    assignments.find((a) => a.id === selectedAsgId) || assignments[0];

  const currentSubmission = submissions.find(
    (s) => s.assignmentId === currentAssignment.id && s.studentRoll === user.rollNumber
  );

  const evalResult = evaluateSubmissionStatus(
    serverTime,
    currentAssignment.deadline,
    currentSubmission?.extensionGranted || activePreset === 'extension_granted',
    currentSubmission?.extendedDeadline
  );

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setUploadError(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setUploadError(null);
    const validation = validateUploadFile({ name: file.name, size: file.size });
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleExecuteUpload = () => {
    if (!selectedFile) return;

    if (!evalResult.uploadAllowed) {
      setUploadError('Submission window is strictly closed (>48 hours past deadline).');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    // Realistic progress animation
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      const result = submitStudentFile(currentAssignment.id, {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      });

      setIsUploading(false);

      if (result.success && result.receipt) {
        setRecentReceipt(result.receipt);
        setSelectedFile(null);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } else {
        setUploadError(result.error || 'Failed to submit file');
      }
    }, 850);
  };

  return (
    <div className="space-y-6">
      {/* Title & Assignment Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Submit Assignment
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Versioned digital dropzone with automated timestamp verification
          </p>
        </div>

        {/* Assignment Dropdown */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-600">Select Task:</label>
          <select
            value={selectedAsgId}
            onChange={(e) => {
              setSelectedAsgId(e.target.value);
              setRecentReceipt(null);
              setSelectedFile(null);
              setUploadError(null);
            }}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-xs focus:ring-2 focus:ring-blue-500"
          >
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.courseCode}: {a.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Boundary Evaluation Status Card */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border-2 transition-all shadow-xs ${evalResult.bannerClass}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-white/90 shadow-xs shrink-0 mt-0.5">
              {evalResult.status === 'ON_TIME' && (
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              )}
              {evalResult.status === 'LATE_BAND_1' && (
                <Clock className="w-6 h-6 text-amber-600 animate-pulse" />
              )}
              {evalResult.status === 'LATE_BAND_2' && (
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              )}
              {evalResult.status === 'CLOSED' && (
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-base">
                  Status: {evalResult.label}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/95 shadow-2xs border border-black/5">
                  Applied Penalty: {evalResult.penaltyPercent}%
                </span>
                {evalResult.penaltyPercent > 0 && (
                  <span className="text-[11px] font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                    Factor: &times;{(1 - evalResult.penaltyMultiplier).toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-xs mt-1 leading-relaxed opacity-95">
                {evalResult.description}
              </p>

              <div className="text-[11px] mt-2 font-mono flex items-center gap-2 flex-wrap text-slate-700">
                <span>Evaluated at Server Clock: <strong>{formatIST(serverTime)}</strong></span>
                <span>• Deadline D: <strong>{formatIST(currentAssignment.deadline)}</strong></span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0 bg-white/60 p-3 rounded-xl border border-black/5">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Penalty Rule
            </div>
            <div className="text-sm font-extrabold text-slate-800">
              {evalResult.penaltyPercent === 0
                ? '0% (Full Marks)'
                : `-${evalResult.penaltyPercent}% from Awarded`}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Rounded to 1 decimal place
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Card if just submitted */}
      {recentReceipt && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-5 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex items-start space-x-3.5">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Submission Successfully Logged
              </span>
              <h3 className="text-lg font-extrabold text-emerald-950 mt-0.5">
                Receipt Number: {recentReceipt}
              </h3>
              <p className="text-xs text-emerald-800 mt-1">
                Your file has been verified and registered on the institutional ledger with cryptographic SHA-256 hash stamp.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white/80 rounded-xl border border-emerald-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500">Student Roll</span>
              <div className="font-bold text-slate-900">{user.rollNumber} ({user.name})</div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500">Recorded Timestamp (IST)</span>
              <div className="font-bold text-slate-900">{formatIST(serverTime)}</div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500">Email Notification</span>
              <div className="font-bold text-emerald-700 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                Receipt Emailed to {user.email}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Zone & Submission Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-bold text-slate-900">
              Upload Active File
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Versions Kept: {currentSubmission ? currentSubmission.versions.length : 0} of 5 max
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Accepts PDF, DOCX, or ZIP only. Maximum allowable file size: 10.0 MB. Latest version will be evaluated.
          </p>
        </div>

        {/* Dropzone Container */}
        {evalResult.uploadAllowed ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              selectedFile
                ? 'border-blue-500 bg-blue-50/30'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.zip"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelection(e.target.files[0]);
                }
              }}
            />

            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 mx-auto flex items-center justify-center mb-3 shadow-inner">
              <UploadCloud className="w-7 h-7" />
            </div>

            {selectedFile ? (
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">{selectedFile.name}</p>
                <p className="text-xs text-slate-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for submission
                </p>
                <span className="inline-block mt-2 text-xs font-semibold text-blue-600 underline">
                  Click to choose a different file
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800">
                  Drag &amp; drop your submission file here, or{' '}
                  <span className="text-blue-700 underline font-bold">browse local files</span>
                </p>
                <p className="text-xs text-slate-400">
                  Supported formats: PDF (.pdf), Word (.docx), Zip (.zip) • Max 10 MB
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="border-2 border-rose-200 bg-rose-50/60 rounded-2xl p-8 text-center space-y-2">
            <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto" />
            <h3 className="font-bold text-sm text-rose-900">Upload Portal Closed</h3>
            <p className="text-xs text-rose-700 max-w-md mx-auto">
              More than 48 hours have elapsed past deadline D. New uploads or replacements are blocked unless granted an official faculty extension.
            </p>
          </div>
        )}

        {/* Upload Error Banner */}
        {uploadError && (
          <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Progress Bar */}
        {isUploading && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Uploading to Institutional Storage...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-blue-600 transition-all duration-200 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Button */}
        {evalResult.uploadAllowed && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-500">
              {currentSubmission && currentSubmission.versions.length > 0 ? (
                <span>
                  Uploading will create <strong>Version {currentSubmission.versions.length + 1}</strong> and replace the active submission.
                </span>
              ) : (
                <span>First submission will be recorded as <strong>Version 1</strong>.</span>
              )}
            </div>

            <button
              onClick={handleExecuteUpload}
              disabled={!selectedFile || isUploading}
              className="px-6 py-2.5 bg-[#1F3864] hover:bg-[#152644] disabled:bg-slate-300 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Submission...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  <span>
                    {currentSubmission && currentSubmission.versions.length > 0
                      ? 'Submit New Version'
                      : 'Confirm & Submit'}
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Version History Table (up to 5) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Submission Version History
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Keeps up to 5 versions • Latest is evaluated
          </span>
        </div>

        {currentSubmission && currentSubmission.versions.length > 0 ? (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Ver</th>
                  <th className="py-2.5 px-4">File Name</th>
                  <th className="py-2.5 px-4">Size</th>
                  <th className="py-2.5 px-4">Timestamp (IST)</th>
                  <th className="py-2.5 px-4">Receipt #</th>
                  <th className="py-2.5 px-4">Status Band</th>
                  <th className="py-2.5 px-4 text-center">Active For Evaluation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {currentSubmission.versions.map((v) => {
                  const isActive = v.versionNumber === currentSubmission.activeVersion;
                  return (
                    <tr
                      key={v.versionNumber}
                      className={isActive ? 'bg-blue-50/50 font-medium' : 'hover:bg-slate-50'}
                    >
                      <td className="py-3 px-4 font-bold text-slate-900">v{v.versionNumber}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        {v.fileName}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {(v.fileSize / (1024 * 1024)).toFixed(2)} MB
                      </td>
                      <td className="py-3 px-4 text-slate-600">{formatIST(v.submittedAt)}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {v.receiptNumber}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            v.penaltyPercent === 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : v.penaltyPercent === 10
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {v.status} (-{v.penaltyPercent}%)
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Latest (Evaluated)
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Superseded</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
            No submissions recorded yet for this assignment.
          </div>
        )}
      </div>
    </div>
  );
};
