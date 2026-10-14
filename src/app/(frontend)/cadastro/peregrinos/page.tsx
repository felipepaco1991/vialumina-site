import { redirect } from 'next/navigation'

/**
 * O cadastro de clientes agora é o painel "Cadastre-se" da página de contato; o conteúdo institucional da
 * antiga landing foi para /quem-somos. Esta rota só preserva links antigos, mantendo origem e UTMs.
 */
export default async function PeregrinosPage({ searchParams }: PageProps<'/cadastro/peregrinos'>) {
  const params = await searchParams
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    for (const v of Array.isArray(value) ? value : [value]) if (v !== undefined) query.append(key, v)
  }
  query.set('cadastro', '1')
  redirect(`/contato?${query.toString()}`)
}
