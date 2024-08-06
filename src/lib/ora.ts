import type { Options, Ora } from "ora"

type TOraInstance = (options?: string | Options | undefined) => Ora

let gora: TOraInstance | null = null

export const loadOra = async () => {
  if (gora) return gora
  const resolvedOra = await import("ora").then((_ora) => _ora.default)
  gora = resolvedOra
  return resolvedOra
}
