import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../supabase/client'

export default function AdminRoute({ children }) {
  const [allowed, setAllowed] = useState(null) // null -> loading, true/false -> готово

  useEffect(() => {
    const run = async () => {
      const { data: sess } = await supabase.auth.getSession()
      const session = sess?.session
      if (!session) { setAllowed(false); return }
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle()
      if (error) { setAllowed(false); return }
      setAllowed(data?.role === 'admin')
    }
    run()
  }, [])

  if (allowed === null) return <div className="text-sm text-gray-500">Загрузка…</div>
  if (!allowed) return <Navigate to="/" replace />

  return children
}
