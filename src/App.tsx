import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import DashboardPage from './pages/DashboardPage'
import LearningPage from './pages/LearningPage'
import CoursesPage from './pages/CoursesPage'
import CurriculumPage from './pages/CurriculumPage'
import StudentStudioPage from './pages/StudentStudioPage'
import LecturerStudioPage from './pages/LecturerStudioPage'
import AssessmentsPage from './pages/AssessmentsPage'
import CertificatesPage from './pages/CertificatesPage'
import ProfilePage from './pages/ProfilePage'
import HybridAIPage from './pages/HybridAIPage'
import AIAgentPage from './pages/AIAgentPage'
import SettingsPage from './pages/SettingsPage'
import OpportunitiesPage from './pages/OpportunitiesPage'
import ProgressPage from './pages/ProgressPage'
import MessagesPage from './pages/MessagesPage'
import CommunityPage from './pages/CommunityPage'
import NotificationsPage from './pages/NotificationsPage'
import { AISettingsProvider } from './context/AISettingsContext'

export default function App() {
  return (
    <AISettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
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
            <Route path="opportunities" element={<OpportunitiesPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AISettingsProvider>
  )
}
