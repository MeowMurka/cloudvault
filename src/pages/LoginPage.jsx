import { useState } from 'react'
import { supabase } from '../supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')

  const handleAuth = async () => {
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      setMessage(error ? error.message : 'Регистрация успешна, проверьте почту.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      setMessage(error ? error.message : 'Вход выполнен.')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl mb-4">{isSignUp ? 'Регистрация' : 'Вход'}</h1>
      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-3"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        className="border p-2 w-full mb-3"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button
        onClick={handleAuth}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {isSignUp ? 'Зарегистрироваться' : 'Войти'}
      </button>
      <p
        className="mt-3 text-sm text-blue-600 cursor-pointer"
        onClick={() => setIsSignUp(!isSignUp)}
      >
        {isSignUp ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
      </p>
      {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
    </div>
  )
}
