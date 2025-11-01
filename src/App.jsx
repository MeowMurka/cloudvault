import { Routes, Route, Link } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import AdminPage from './pages/AdminPage'
import PublicPage from './pages/PublicPage'

export default function App() {
  return (
    <div className="p-4">
      <nav className="flex gap-4 mb-6">
        <Link to="/">Главная</Link>
        <Link to="/dashboard">Мой склад</Link>
        <Link to="/public">Открытые склады</Link>
        <Link to="/admin">Админ</Link>
      </nav>

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/public" element={<PublicPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  )
}
