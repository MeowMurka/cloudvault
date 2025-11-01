import { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'

export default function Dashboard() {
  const [session, setSession] = useState(null)
  const [warehouse, setWarehouse] = useState(null)
  const [products, setProducts] = useState([])
  const [newProduct, setNewProduct] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
  }, [])

  useEffect(() => {
    if (session) loadWarehouse()
  }, [session])

  const loadWarehouse = async () => {
    setMsg('')
    const { data, error } = await supabase
      .from('warehouses')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle()
    if (error) { setMsg(error.message) }
    setWarehouse(data || null)

    if (data) {
      const { data: prods, error: pe } = await supabase
        .from('products')
        .select('*')
        .eq('warehouse_id', data.id)
      if (pe) setMsg(pe.message)
      setProducts(prods || [])
    } else {
      setProducts([])
    }
  }

  const createWarehouse = async () => {
    const name = prompt('Введите название склада:')
    if (!name) return
    const { error } = await supabase.from('warehouses').insert({
      user_id: session.user.id,
      name,
      address: '',
      phone: '',
      is_public: false,
    })
    if (error) { setMsg(error.message); return }
    await loadWarehouse()
  }

  const saveWarehouseMeta = async (patch) => {
    if (!warehouse) return
    const { error } = await supabase
      .from('warehouses')
      .update(patch)
      .eq('id', warehouse.id)
    if (error) { setMsg(error.message); return }
    await loadWarehouse()
  }

  const addProduct = async () => {
    if (!newProduct.trim()) return
    const { error } = await supabase.from('products').insert({
      warehouse_id: warehouse.id,
      name: newProduct.trim(),
      quantity: 1,
    })
    if (error) { setMsg(error.message); return }
    setNewProduct('')
    await loadWarehouse()
  }

  const updateProductQty = async (id, qty) => {
    const q = Math.max(0, parseInt(qty || 0, 10))
    const { error } = await supabase
      .from('products')
      .update({ quantity: q })
      .eq('id', id)
    if (error) { setMsg(error.message); return }
    setProducts(prev => prev.map(p => p.id === id ? { ...p, quantity: q } : p))
  }

  const deleteProduct = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) { setMsg(error.message); return }
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  if (!session) return <p>Пожалуйста, войдите.</p>

  if (!warehouse)
    return (
      <div>
        {msg && <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">Ошибка: {msg}</div>}
        <button
          onClick={createWarehouse}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Создать склад
        </button>
      </div>
    )

  return (
    <div>
      {msg && <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">Ошибка: {msg}</div>}

      <h2 className="text-xl mb-3">Мой склад: {warehouse.name}</h2>

      <div className="grid gap-3 md:grid-cols-2 mb-4">
        <label className="block">
          <span className="text-sm text-gray-600">Название склада</span>
          <input
            className="border p-2 w-full"
            defaultValue={warehouse.name}
            onBlur={(e) => saveWarehouseMeta({ name: e.target.value })}
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600">Телефон</span>
          <input
            className="border p-2 w-full"
            defaultValue={warehouse.phone || ''}
            onBlur={(e) => saveWarehouseMeta({ phone: e.target.value })}
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm text-gray-600">Адрес</span>
          <input
            className="border p-2 w-full"
            defaultValue={warehouse.address || ''}
            onBlur={(e) => saveWarehouseMeta({ address: e.target.value })}
          />
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!warehouse.is_public}
            onChange={(e) => saveWarehouseMeta({ is_public: e.target.checked })}
          />
          <span>Открытый склад (виден гостям)</span>
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          placeholder="Новый товар"
          className="border p-2"
          value={newProduct}
          onChange={e => setNewProduct(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') addProduct() }}
        />
        <button onClick={addProduct} className="bg-blue-600 text-white px-3 py-2 rounded">
          Добавить
        </button>
      </div>

      <ul className="mt-4">
        {products.map(p => (
          <li key={p.id} className="flex items-center gap-3 border-b py-2">
            <span className="flex-1">{p.name}</span>
            <div className="flex items-center gap-2">
              <button
                className="px-2 py-1 border rounded"
                onClick={() => updateProductQty(p.id, p.quantity - 1)}
              >
                −
              </button>
              <input
                type="number"
                className="w-20 border p-1 text-center"
                value={p.quantity}
                min={0}
                onChange={(e) => {
                  const val = e.target.value
                  setProducts(prev => prev.map(x => x.id === p.id ? { ...x, quantity: val } : x))
                }}
                onBlur={(e) => updateProductQty(p.id, e.target.value)}
              />
              <button
                className="px-2 py-1 border rounded"
                onClick={() => updateProductQty(p.id, p.quantity + 1)}
              >
                +
              </button>
            </div>
            <button onClick={() => deleteProduct(p.id)} className="text-red-600 ml-2">
              Удалить
            </button>
          </li>
        ))}
        {products.length === 0 && <li className="py-2 text-sm text-gray-500">Товаров нет</li>}
      </ul>
    </div>
  )
}
