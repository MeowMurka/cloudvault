import { Routes, Route, Link } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AdminPage from './pages/AdminPage.jsx'
import PublicPage from './pages/PublicPage.jsx'
import UserBadge from './components/UserBadge.jsx'
import AdminRoute from './components/AdminRoute.jsx'

export default function App() {
  return (
    <div className="p-4">
      <nav className="flex items-center gap-4 mb-6">
        <Link to="/">Главная</Link>
        <Link to="/dashboard">Мой склад</Link>
        <Link to="/public">Открытые склады</Link>
        <Link to="/admin">Админ</Link>
        <UserBadge />
      </nav>

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/public" element={<PublicPage />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  )
}
