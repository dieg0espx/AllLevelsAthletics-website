export function maskEmail(value: unknown): string {
  if (typeof value !== 'string' || !value.includes('@')) return '[redacted]'
  const [local, domain] = value.split('@')
  if (!domain) return '[redacted]'
  const head = local.slice(0, 2)
  return `${head}***@${domain}`
}

export function maskId(value: unknown): string {
  if (typeof value !== 'string' || value.length < 8) return '[redacted]'
  return `${value.slice(0, 8)}…`
}
