import { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'

export default function Dashboard() {
  const [session, setSession] = useState(null)
  const [warehouse, setWarehouse] = useState(null)
  const [products, setProducts] = useState([])
  const [newProduct, setNewProduct] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
  }, [])

  useEffect(() => {
    if (session) loadWarehouse()
  }, [session])

  const loadWarehouse = async () => {
    const { data } = await supabase
      .from('warehouses')
      .select('*')
      .eq('user_id', session.user.id)
      .single()
    setWarehouse(data)

    if (data) {
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('warehouse_id', data.id)
      setProducts(products)
    }
  }

  const createWarehouse = async () => {
    const name = prompt('Введите название склада:')
    if (!name) return
    await supabase.from('warehouses').insert({ user_id: session.user.id, name })
    loadWarehouse()
  }

  const addProduct = async () => {
    if (!newProduct) return
    await supabase.from('products').insert({
      warehouse_id: warehouse.id,
      name: newProduct,
      quantity: 1,
    })
    setNewProduct('')
    loadWarehouse()
  }

  const deleteProduct = async (id) => {
    await supabase.from('products').delete().eq('id', id)
    loadWarehouse()
  }

  if (!session) return <p>Пожалуйста, войдите.</p>
  if (!warehouse)
    return (
      <button
        onClick={createWarehouse}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Создать склад
      </button>
    )

  return (
    <div>
      <h2 className="text-xl mb-2">Мой склад: {warehouse.name}</h2>
      <input
        placeholder="Новый товар"
        className="border p-2 mr-2"
        value={newProduct}
        onChange={e => setNewProduct(e.target.value)}
      />
      <button onClick={addProduct} className="bg-blue-600 text-white px-3 py-2 rounded">
        Добавить
      </button>

      <ul className="mt-4">
        {products.map(p => (
          <li key={p.id} className="flex justify-between border-b py-2">
            {p.name} ({p.quantity})
            <button onClick={() => deleteProduct(p.id)} className="text-red-600">
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
