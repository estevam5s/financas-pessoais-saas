import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react"
import { supabase, isAdminEmail, authFetch } from "@/lib/supabaseClient"

export type SubData = {
  subscription: any; plan: any; plans: any[]; is_admin: boolean
  trial_active: boolean; trial_ends_at: string | null; has_access: boolean; limits: Record<string, any>
}

interface Ctx {
  user: any
  loading: boolean
  sub: SubData | null
  isAdmin: boolean
  hasAccess: boolean
  signIn: (e: string, p: string) => Promise<{ error: any }>
  signUp: (e: string, p: string, name: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  reload: () => Promise<void>
}

const AuthContext = createContext<Ctx | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sub, setSub] = useState<SubData | null>(null)

  const loadSub = useCallback(async () => {
    try { const res = await authFetch("/api/subscription"); if (res.ok) setSub(await res.json()) } catch { /* noop */ }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null); setLoading(false); if (session?.user) loadSub()
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null); if (session?.user) loadSub(); else setSub(null)
    })
    return () => subscription.unsubscribe()
  }, [loadSub])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) await loadSub()
    return { error }
  }
  const signUp = async (email: string, password: string, full_name: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name } } })
    if (error) return { error }
    if (!data.session) { const r = await supabase.auth.signInWithPassword({ email, password }); if (!r.error) await loadSub(); return { error: r.error } }
    await loadSub(); return { error: null }
  }
  const signOut = async () => { await supabase.auth.signOut(); setUser(null); setSub(null) }

  const isAdmin = isAdminEmail(user?.email)
  const hasAccess = isAdmin || !!sub?.has_access

  return (
    <AuthContext.Provider value={{ user, loading, sub, isAdmin, hasAccess, signIn, signUp, signOut, reload: loadSub }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const c = useContext(AuthContext)
  if (!c) throw new Error("useAuth must be used within AuthProvider")
  return c
}
