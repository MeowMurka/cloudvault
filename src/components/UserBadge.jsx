import { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'

export default function UserBadge() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      const { data: sess } = await supabase.auth.getSession()
      const session = sess?.session
      if (!session) { setLoading(false); return }
      setEmail(session.user.email || '')

      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle()
      if (!error && data) setRole(data.role)
      setLoading(false)
    }
    run()
  }, [])

  if (loading) return null
  if (!email) return <span className="text-sm text-gray-500">Гость</span>

  return (
    <div className="ml-auto text-sm text-gray-700">
      <span className="px-2 py-1 rounded bg-gray-200">
        {email} • роль: <strong>{role || 'user'}</strong>
      </span>
    </div>
  )
}
