import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentAssignments, StudentAssignmentDetail } from './pages/student/StudentAssignments';
import { StudentSubmit } from './pages/student/StudentSubmit';
import { StudentResults } from './pages/student/StudentResults';

// Faculty Pages
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { FacultyCreateAssignment } from './pages/faculty/FacultyCreateAssignment';
import { FacultySubmissions } from './pages/faculty/FacultySubmissions';
import { FacultyReleaseFeedback } from './pages/faculty/FacultyReleaseFeedback';

// Dean Pages
import { DeanDashboard } from './pages/dean/DeanDashboard';
import { DeanReadiness } from './pages/dean/DeanReadiness';
import { DeanRisks } from './pages/dean/DeanRisks';

// Assessment Cell Pages
import { AssessmentCellExport } from './pages/assessment_cell/AssessmentCellExport';
import { AssessmentCellReconciliation } from './pages/assessment_cell/AssessmentCellReconciliation';

// Admin Pages
import { AdminImport } from './pages/admin/AdminImport';
import { AdminHealth } from './pages/admin/AdminHealth';
import { AdminLogs } from './pages/admin/AdminLogs';

const RootRedirect: React.FC = () => {
  const { role } = useApp();
  return <Navigate to={`/${role}`} replace />;
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public / Role Picker Screen */}
          <Route path="/login" element={<Login />} />

          {/* Core Layout Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<RootRedirect />} />

            {/* Student Routes */}
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/assignments" element={<StudentAssignments />} />
            <Route path="/student/assignments/:id" element={<StudentAssignmentDetail />} />
            <Route path="/student/submit" element={<StudentSubmit />} />
            <Route path="/student/results" element={<StudentResults />} />

            {/* Faculty Routes */}
            <Route path="/faculty" element={<FacultyDashboard />} />
            <Route path="/faculty/create" element={<FacultyCreateAssignment />} />
            <Route path="/faculty/submissions" element={<FacultySubmissions />} />
            <Route path="/faculty/feedback" element={<FacultyReleaseFeedback />} />

            {/* Dean Routes */}
            <Route path="/dean" element={<DeanDashboard />} />
            <Route path="/dean/readiness" element={<DeanReadiness />} />
            <Route path="/dean/risks" element={<DeanRisks />} />

            {/* Assessment Cell Routes */}
            <Route path="/assessment_cell" element={<AssessmentCellExport />} />
            <Route path="/assessment_cell/reconciliation" element={<AssessmentCellReconciliation />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminImport />} />
            <Route path="/admin/health" element={<AdminHealth />} />
            <Route path="/admin/logs" element={<AdminLogs />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
