"use client"
import { getAuthClient, googleProvider } from '@/lib/firebase/client'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import { useMemo, useState } from 'react'

export const dynamic = 'force-dynamic'

type FormValues = { email: string; password: string }

export default function AuthPage() {
  const auth = useMemo(() => (typeof window !== 'undefined' ? getAuthClient() : null), [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit } = useForm<FormValues>()

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Autentificare</h1>
      <form
        className="bg-white p-4 rounded-lg shadow space-y-3"
        onSubmit={handleSubmit(async (data) => {
          if (!auth) return
          setLoading(true)
          setError(null)
          try {
            await signInWithEmailAndPassword(auth, data.email, data.password)
          } catch (e: any) {
            setError(e?.message ?? 'Autentificare eșuată')
          } finally {
            setLoading(false)
          }
        })}
      >
        <input className="w-full border rounded px-3 py-2" placeholder="Email" type="email" {...register('email')} />
        <input className="w-full border rounded px-3 py-2" placeholder="Parolă" type="password" {...register('password')} />
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
        <button className="btn-primary w-full" disabled={loading || !auth} type="submit">Continuă</button>
      </form>

      <div className="mt-4">
        <button className="btn-accent w-full" disabled={!auth} onClick={() => auth && signInWithPopup(auth, googleProvider)}>Continuă cu Google</button>
      </div>
    </main>
  )
}

