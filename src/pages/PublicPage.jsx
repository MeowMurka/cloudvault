import { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'

export default function PublicPage() {
  const [warehouses, setWarehouses] = useState([])
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)
  const [products, setProducts] = useState([])

  useEffect(() => {
    loadPublicWarehouses()
  }, [])

  const loadPublicWarehouses = async () => {
    const { data } = await supabase.from('warehouses').select('*').eq('is_public', true)
    setWarehouses(data)
  }

  const openWarehouse = async (warehouse) => {
    setSelectedWarehouse(warehouse)
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('warehouse_id', warehouse.id)
    setProducts(data)
  }

  return (
    <div>
      <h2 className="text-xl mb-3">Открытые склады</h2>
      <ul className="mb-4">
        {warehouses.map((w) => (
          <li
            key={w.id}
            className="cursor-pointer border-b py-2"
            onClick={() => openWarehouse(w)}
          >
            {w.name}
          </li>
        ))}
      </ul>

      {selectedWarehouse && (
        <div>
          <h3 className="text-lg mb-2">Товары на складе {selectedWarehouse.name}</h3>
          <ul>
            {products.map((p) => (
              <li key={p.id} className="border-b py-1">
                {p.name} ({p.quantity})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
