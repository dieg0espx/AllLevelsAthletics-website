import { NextRequest, NextResponse } from 'next/server'
import type { User } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase'

type AuthSuccess = { user: User; error: null }
type AuthFailure = { user: null; error: NextResponse }
export type AuthResult = AuthSuccess | AuthFailure

function unauthorized(message = 'Unauthorized'): AuthFailure {
  return {
    user: null,
    error: NextResponse.json({ error: message }, { status: 401 }),
  }
}

function forbidden(message = 'Forbidden'): AuthFailure {
  return {
    user: null,
    error: NextResponse.json({ error: message }, { status: 403 }),
  }
}

function serverConfigError(): AuthFailure {
  return {
    user: null,
    error: NextResponse.json({ error: 'Server configuration error' }, { status: 500 }),
  }
}

function extractBearerToken(req: NextRequest): string | null {
  const header = req.headers.get('authorization') || req.headers.get('Authorization')
  if (!header) return null
  const [scheme, token] = header.split(' ')
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null
  return token.trim() || null
}

export async function requireUser(req: NextRequest): Promise<AuthResult> {
  if (!supabaseAdmin) return serverConfigError()

  const token = extractBearerToken(req)
  if (!token) return unauthorized()

  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data.user) return unauthorized()

  return { user: data.user, error: null }
}

export async function requireAdmin(req: NextRequest): Promise<AuthResult> {
  const auth = await requireUser(req)
  if (auth.error) return auth

  if (!supabaseAdmin) return serverConfigError()

  const metadataRole = auth.user.user_metadata?.role
  if (metadataRole === 'admin') return { user: auth.user, error: null }

  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('role')
    .eq('user_id', auth.user.id)
    .single()

  if (profile?.role === 'admin') return { user: auth.user, error: null }

  return forbidden()
}
