import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
const LandingPage = lazy(() => import('./pages/LandingPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const CreatorStudioPage = lazy(() => import('./pages/CreatorStudioPage'))
const LearningPage = lazy(() => import('./pages/LearningPage'))
const CoursesPage = lazy(() => import('./pages/CoursesPage'))
const CurriculumPage = lazy(() => import('./pages/CurriculumPage'))
const StudentStudioPage = lazy(() => import('./pages/StudentStudioPage'))
const LecturerStudioPage = lazy(() => import('./pages/LecturerStudioPage'))
const AssessmentsPage = lazy(() => import('./pages/AssessmentsPage'))
const CertificatesPage = lazy(() => import('./pages/CertificatesPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const HybridAIPage = lazy(() => import('./pages/HybridAIPage'))
const AIAgentPage = lazy(() => import('./pages/AIAgentPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const OpportunitiesPage = lazy(() => import('./pages/OpportunitiesPage'))
const ProgressPage = lazy(() => import('./pages/ProgressPage'))
const MessagesPage = lazy(() => import('./pages/MessagesPage'))
const CommunityPage = lazy(() => import('./pages/CommunityPage'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))
import { AISettingsProvider } from './context/AISettingsContext'
import { AuthProvider } from './context/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <AISettingsProvider>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<div className="edu-page" role="status">Loading NEXORA...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/forgot-password" element={<AuthPage />} />
            <Route path="/verify-email" element={<AuthPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="creator-studio" element={<CreatorStudioPage />} />
                <Route path="creator-studio/:studio" element={<CreatorStudioPage />} />
                <Route path="hybrid-ai" element={<HybridAIPage />} />
                <Route path="ai-agent" element={<AIAgentPage />} />
                <Route path="learning" element={<LearningPage />} />
                <Route path="student-studio" element={<StudentStudioPage />} />
                <Route path="lecturer-studio" element={<LecturerStudioPage />} />
                <Route path="courses" element={<CoursesPage />} />
                <Route path="curriculum" element={<CurriculumPage />} />
                <Route path="assessments" element={<AssessmentsPage />} />
                <Route path="certificates" element={<CertificatesPage />} />
                <Route path="progress" element={<ProgressPage />} />
                <Route path="community" element={<CommunityPage />} />
                <Route path="opportunities" element={<OpportunitiesPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </AISettingsProvider>
  )
}
