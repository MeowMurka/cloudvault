import { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'

export default function AdminPage() {
  const [session, setSession] = useState(null)
  const [warehouses, setWarehouses] = useState([])
  const [emailById, setEmailById] = useState({})
  const [err, setErr] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
  }, [])

  useEffect(() => {
    if (session) loadData()
  }, [session])

  const loadData = async () => {
    setErr('')

<<<<<<< HEAD
=======
    // 1) Словарь пользователей: { [id]: email }
>>>>>>> b39d2c660b74f8caf4e5e21c64ab04850425293e
    const { data: users, error: usersErr } = await supabase
      .from('users')
      .select('id,email')
    if (usersErr) {
      console.error(usersErr)
      setErr(`Ошибка загрузки пользователей: ${usersErr.message}`)
      setEmailById({})
    } else {
      const map = {}
      ;(users || []).forEach(u => { map[u.id] = u.email })
      setEmailById(map)
    }

<<<<<<< HEAD
=======
    // 2) Все склады (без embed!)
>>>>>>> b39d2c660b74f8caf4e5e21c64ab04850425293e
    const { data: wh, error: whErr } = await supabase
      .from('warehouses')
      .select('*')
    if (whErr) {
      console.error(whErr)
      setErr(prev => prev || `Ошибка загрузки складов: ${whErr.message}`)
      setWarehouses([])
    } else {
      setWarehouses(wh || [])
    }
  }

  const deleteWarehouse = async (id) => {
    setErr('')
    const { error } = await supabase.from('warehouses').delete().eq('id', id)
    if (error) {
      console.error(error)
      setErr(`Ошибка удаления: ${error.message}`)
    }
    await loadData()
  }

  if (!session) return <p>Пожалуйста, войдите как администратор.</p>

  return (
    <div>
      <h2 className="text-xl mb-4">Админ-панель</h2>
      {err && <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">Ошибка: {err}</div>}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Название</th>
            <th className="p-2 border">Пользователь</th>
            <th className="p-2 border">Публичный</th>
            <th className="p-2 border">Действие</th>
          </tr>
        </thead>
        <tbody>
          {(warehouses || []).map((w) => (
            <tr key={w.id} className="text-center border-b">
              <td className="p-2 border">{w.name}</td>
<<<<<<< HEAD
              <td className="p-2 border">{emailById[w.user_id] || w.user_id}</td>
=======
              <td className="p-2 border">
                {emailById[w.user_id] || w.user_id}
              </td>
>>>>>>> b39d2c660b74f8caf4e5e21c64ab04850425293e
              <td className="p-2 border">{w.is_public ? 'Да' : 'Нет'}</td>
              <td className="p-2 border">
                <button
                  onClick={() => deleteWarehouse(w.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
          {warehouses.length === 0 && (
            <tr>
              <td className="p-3 text-center" colSpan={4}>Складов нет</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
