import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { PRIVACY_NOTICE_VERSION } from '@/lib/leads/constants'
import { getSiteSettings } from '@/lib/settings.server'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Como a Via Lumina Viagens coleta, utiliza e protege os dados pessoais de quem visita o site e solicita atendimento.',
  alternates: { canonical: '/politica-de-privacidade' },
}

// Texto-base preparado na migração. Deve ser revisado pelo jurídico do Grupo Arbo antes da publicação.
// Ao alterar o texto dos cadastros (seção 3-A), atualize também PRIVACY_NOTICE_VERSION em src/lib/leads/constants.ts.
const UPDATED_AT = '09 de outubro de 2026'

export default async function PrivacyPage() {
  const s = await getSiteSettings()
  const sections: { title: string; body: React.ReactNode }[] = [
    {
      title: '1. Quem somos',
      body: (
        <p>
          Esta política se aplica ao site da Via Lumina Viagens, marca do Grupo Arbo dedicada ao turismo religioso. Em caso de dúvidas sobre o tratamento dos seus dados pessoais, fale conosco pelo e-mail{' '}
          <a href={`mailto:${s.email}`}>{s.email}</a>.
        </p>
      ),
    },
    {
      title: '2. Dados que coletamos',
      body: (
        <ul>
          <li>Dados informados por você no formulário de contato: nome, e-mail, WhatsApp, peregrinação de interesse e mensagem.</li>
          <li>Dados de navegação, somente se você aceitar os cookies de medição: páginas visitadas, cliques em botões e interações com os filtros, de forma agregada.</li>
          <li>Conversas iniciadas por você no WhatsApp seguem também as políticas da plataforma WhatsApp.</li>
        </ul>
      ),
    },
    {
      title: '3. Para que usamos os dados',
      body: (
        <ul>
          <li>Responder às suas solicitações e enviar informações sobre as peregrinações de seu interesse (base legal: procedimentos preliminares a contrato e consentimento).</li>
          <li>Melhorar o site e entender quais conteúdos são mais úteis (base legal: consentimento, quando aplicável).</li>
          <li>Cumprir obrigações legais e regulatórias.</li>
        </ul>
      ),
    },
    {
      title: '3-A. Cadastros de peregrinos, padres e agências',
      body: (
        <>
          <p>
            Nos formulários de cadastro (<a href="/cadastro">/cadastro</a>) coletamos apenas os dados necessários à finalidade informada em cada página: contato (nome, e-mail, WhatsApp, cidade e estado), as informações do perfil
            (por exemplo, diocese e paróquia, no caso de padres; dados da empresa, no caso de agências; igreja ou comunidade e forma de atuação, no caso de formadores de grupo; destinos e período de interesse, no caso de peregrinos) e a origem do cadastro (página e campanha de divulgação). Não pedimos
            CPF nem dados financeiros.
          </p>
          <ul>
            <li>
              <strong>Finalidade principal (obrigatória para o cadastro):</strong> avaliar o cadastro e entrar em contato sobre o interesse manifestado. O cadastro é apenas uma manifestação de interesse: não confirma parceria,
              credenciamento nem reserva de viagem.
            </li>
            <li>
              <strong>Comunicações promocionais (opcional):</strong> envio de novidades, roteiros e ofertas por e-mail e WhatsApp, mediante consentimento separado. Recusar não impede o cadastro nem o contato solicitado.
            </li>
            <li>
              <strong>Retirada do consentimento:</strong> a qualquer momento, pelo link “deixar de receber” enviado nas comunicações ou pelo e-mail <a href={`mailto:${s.email}`}>{s.email}</a>. A retirada é registrada com data e hora.
            </li>
            <li>
              <strong>Registro:</strong> guardamos a data, a versão deste aviso (versão {PRIVACY_NOTICE_VERSION}) e a finalidade de cada consentimento.
            </li>
            <li>
              <strong>Retenção:</strong> os cadastros são mantidos pelo prazo definido em nossa política interna (24 meses sem atualização, salvo atendimento em andamento ou obrigação legal) e depois eliminados ou anonimizados.
            </li>
            <li>
              <strong>Acesso restrito:</strong> somente administradores e a equipe comercial autorizada acessam esses dados.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: '4. Compartilhamento',
      body: (
        <p>
          Não vendemos dados pessoais. Os dados podem ser tratados por empresas do Grupo Arbo e por fornecedores que nos ajudam a operar o site (hospedagem, envio de e-mails e ferramentas de medição), sempre com
          finalidade compatível com esta política.
        </p>
      ),
    },
    {
      title: '5. Cookies',
      body: (
        <p>
          O site usa apenas os cookies necessários ao seu funcionamento. Cookies de medição (Google Analytics / Google Tag Manager) só são ativados após o seu aceite no aviso exibido na primeira visita. O mapa da página de
          contato só é carregado quando você clica em “Carregar mapa”.
        </p>
      ),
    },
    {
      title: '6. Por quanto tempo guardamos',
      body: <p>As solicitações de contato são mantidas pelo tempo necessário ao atendimento e ao cumprimento de obrigações legais, sendo eliminadas ou anonimizadas depois disso.</p>,
    },
    {
      title: '7. Seus direitos',
      body: (
        <p>
          Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode solicitar confirmação de tratamento, acesso, correção, anonimização, portabilidade, eliminação dos dados tratados com consentimento e revogação
          do consentimento, escrevendo para <a href={`mailto:${s.email}`}>{s.email}</a>.
        </p>
      ),
    },
    {
      title: '8. Segurança',
      body: <p>Adotamos medidas técnicas e administrativas para proteger os dados contra acessos não autorizados, como conexão criptografada (HTTPS) e acesso restrito ao painel administrativo.</p>,
    },
    {
      title: '9. Atualizações',
      body: <p>Esta política pode ser atualizada. A versão vigente estará sempre disponível nesta página.</p>,
    },
  ]
  return (
    <>
      <section className="bg-navy-900 pt-32 pb-14 text-white sm:pb-20">
        <div className="container-site max-w-3xl!">
          <Breadcrumbs items={[{ label: 'Política de Privacidade', href: '/politica-de-privacidade' }]} className="mb-6" />
          <h1 className="text-[2.5rem] leading-tight font-medium text-white sm:text-6xl">Política de Privacidade</h1>
          <p className="mt-4 text-white/75">Última atualização: {UPDATED_AT}</p>
        </div>
      </section>
      <article className="bg-cream-50 py-16 sm:py-20">
        <div className="container-site max-w-3xl! space-y-10 text-lg leading-relaxed text-slate-700 [&_a]:font-semibold [&_a]:text-navy-900 [&_a]:underline [&_a]:decoration-gold-500 [&_a]:underline-offset-4 [&_li]:mt-2 [&_ul]:list-disc [&_ul]:pl-6">
          {sections.map((sec) => (
            <section key={sec.title}>
              <h2 className="mb-3 text-2xl font-medium">{sec.title}</h2>
              {sec.body}
            </section>
          ))}
        </div>
      </article>
    </>
  )
}
