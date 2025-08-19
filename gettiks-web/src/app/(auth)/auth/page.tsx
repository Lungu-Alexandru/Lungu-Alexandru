"use client";
import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '@/lib/firebase';
import Link from 'next/link';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function loginWithEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <main className="max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Autentificare</h1>
      <form className="space-y-3" onSubmit={loginWithEmail}>
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Parola" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="btn-primary w-full" type="submit">Intră</button>
      </form>
      <div className="flex gap-3">
        <button className="btn-secondary flex-1" onClick={() => signInWithPopup(auth, googleProvider)}>Google</button>
        <button className="btn-secondary flex-1" onClick={() => signInWithPopup(auth, facebookProvider)}>Facebook</button>
      </div>
      <div className="text-sm">
        <Link href="#" className="underline">Continuă ca invitat</Link>
      </div>
    </main>
  );
}

