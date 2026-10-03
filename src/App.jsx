import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import NavBar from './components/NavBar'
import Toasts from './components/Toasts'
import Home from './pages/Home'
import Login from './pages/Login'
import Vault from './pages/Vault'
import PaperDetail from './pages/PaperDetail'
import Syllabus from './pages/Syllabus'
import Upload from './pages/Upload'
import Practice from './pages/Practice'
import AdminQueue from './pages/admin/Queue'
import ReviewPaper from './pages/admin/ReviewPaper'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
          <NavBar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/vault" element={<Vault />} />
              <Route path="/paper/:id" element={<PaperDetail />} />
              <Route path="/syllabus" element={<Syllabus />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/admin" element={<AdminQueue />} />
              <Route path="/admin/:id" element={<ReviewPaper />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <footer className="border-t border-[var(--color-rule)] px-4 py-8 text-center text-xs text-[var(--color-ink-soft)] sm:px-6">
            PaperTrail — Journey to Mastery, Level 2: Kenshi. Frontend only, mock data, no backend yet.
          </footer>
        </div>
        <Toasts />
      </BrowserRouter>
    </AppProvider>
  )
}
