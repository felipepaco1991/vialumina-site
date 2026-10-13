import type { Access, FieldAccess } from 'payload'

type Role = 'admin' | 'editor' | 'comercial'

const hasRole = (user: unknown, roles: Role[]): boolean =>
  Boolean(user && typeof user === 'object' && 'roles' in user && (user.roles as Role[] | undefined)?.some((r) => roles.includes(r)))

/** Qualquer usuário autenticado no painel. */
export const authenticated: Access = ({ req }) => Boolean(req.user)

/** Somente administradores. */
export const adminOnly: Access = ({ req }) => hasRole(req.user, ['admin'])
export const adminOnlyField: FieldAccess = ({ req }) => hasRole(req.user, ['admin'])

/** Administradores e editores de conteúdo. */
export const editors: Access = ({ req }) => hasRole(req.user, ['admin', 'editor'])

/** Equipe que atende cadastros (padres, agências, peregrinos): administradores e equipe comercial. */
export const leadStaff: Access = ({ req }) => hasRole(req.user, ['admin', 'comercial'])
export const leadStaffField: FieldAccess = ({ req }) => hasRole(req.user, ['admin', 'comercial'])

/** Leitura pública. */
export const anyone: Access = () => true

/**
 * Leitura pública apenas de roteiros publicados; usuários do painel veem tudo.
 * "Rascunho" nunca é exposto pela API pública.
 */
export const publishedOrEditors: Access = ({ req }) => {
  if (req.user) return true
  return { status: { not_equals: 'rascunho' } }
}
