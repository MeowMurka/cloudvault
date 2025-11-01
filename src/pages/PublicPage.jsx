import { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'

export default function PublicPage() {
  const [warehouses, setWarehouses] = useState([])
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)
  const [products, setProducts] = useState([])
  const [err, setErr] = useState('')

  useEffect(() => {
    loadPublicWarehouses()
  }, [])

  const loadPublicWarehouses = async () => {
    setErr('')
    const { data, error } = await supabase
      .from('warehouses')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (error) {
      setErr(error.message)
      setWarehouses([])
      return
    }
    setWarehouses(data || [])
  }

  const openWarehouse = async (warehouse) => {
    setSelectedWarehouse(warehouse)
    setErr('')
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('warehouse_id', warehouse.id)

    if (error) {
      setErr(error.message)
      setProducts([])
      return
    }
    setProducts(data || [])
  }

  const fmt = (v) => (v && String(v).trim().length ? String(v).trim() : null)

  return (
    <div>
      <h2 className="text-xl mb-3">Открытые склады</h2>
      {err && <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">Ошибка: {err}</div>}

      <ul className="mb-4 divide-y border rounded bg-white">
        {(warehouses || []).map((w) => {
          const addr = fmt(w.address)
          const phone = fmt(w.phone)
          return (
            <li
              key={w.id}
              className="p-3 cursor-pointer hover:bg-gray-50"
              onClick={() => openWarehouse(w)}
              title="Открыть склад"
            >
              <div className="font-medium">{w.name}</div>
              {(addr || phone) && (
                <div className="text-sm text-gray-600 mt-1">
                  {addr && <span>Адрес: {addr}</span>}
                  {addr && phone && <span> · </span>}
                  {phone && <span>Телефон: {phone}</span>}
                </div>
              )}
            </li>
          )
        })}
        {(!warehouses || warehouses.length === 0) && (
          <li className="p-3 text-sm text-gray-500">Пока нет открытых складов</li>
        )}
      </ul>

      {selectedWarehouse && (
        <div className="bg-white rounded border p-4">
          <h3 className="text-lg font-semibold">{selectedWarehouse.name}</h3>

          <div className="text-sm text-gray-700 mt-1">
            {fmt(selectedWarehouse.address) ? (
              <div>Адрес: {selectedWarehouse.address}</div>
            ) : (
              <div className="text-gray-500">Адрес: не указан</div>
            )}
            {fmt(selectedWarehouse.phone) ? (
              <div>Телефон: {selectedWarehouse.phone}</div>
            ) : (
              <div className="text-gray-500">Телефон: не указан</div>
            )}
          </div>

          <h4 className="mt-4 mb-2 font-medium">Товары</h4>
          <ul className="divide-y">
            {(products || []).map((p) => (
              <li key={p.id} className="py-2 flex justify-between">
                <span>{p.name}</span>
                <span className="text-gray-600">{p.quantity}</span>
              </li>
            ))}
            {(!products || products.length === 0) && (
              <li className="py-2 text-sm text-gray-500">Нет товаров</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
