import { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'

export default function AdminPage() {
  const [session, setSession] = useState(null)
  const [warehouses, setWarehouses] = useState([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
  }, [])

  useEffect(() => {
    if (session) loadAllWarehouses()
  }, [session])

  const loadAllWarehouses = async () => {
    const { data } = await supabase.from('warehouses').select('*, users(email)')
    setWarehouses(data)
  }

  const deleteWarehouse = async (id) => {
    await supabase.from('warehouses').delete().eq('id', id)
    loadAllWarehouses()
  }

  if (!session) return <p>Пожалуйста, войдите как администратор.</p>

  return (
    <div>
      <h2 className="text-xl mb-4">Админ-панель</h2>
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
          {warehouses.map((w) => (
            <tr key={w.id} className="text-center border-b">
              <td className="p-2 border">{w.name}</td>
              <td className="p-2 border">{w.user_id}</td>
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
        </tbody>
      </table>
    </div>
  )
}
