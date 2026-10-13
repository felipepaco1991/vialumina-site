import { expect, test } from '@playwright/test'
import { getPayload } from 'payload'
import config from '../../src/payload.config'

test.describe('Formulário de contato', () => {
  test('valida os campos obrigatórios', async ({ page }) => {
    await page.goto('/contato')
    await page.getByRole('button', { name: 'Enviar mensagem' }).click()
    await expect(page.getByText('Informe seu nome.')).toBeVisible()
    await expect(page.getByText('Informe um e-mail válido.')).toBeVisible()
    await expect(page.getByText('É necessário concordar com a Política de Privacidade.')).toBeVisible()
  })

  test('envio real grava a solicitação no CMS', async ({ page }) => {
    const email = `qa-${Date.now()}@example.com`
    await page.goto('/contato?roteiro=europa-sagrada')
    await expect(page.getByLabel('Destino de interesse')).toHaveValue('europa-sagrada')
    await page.getByRole('textbox', { name: 'Nome' }).fill('Teste Automatizado')
    await page.getByRole('textbox', { name: 'E-mail' }).fill(email)
    await page.getByRole('textbox', { name: 'WhatsApp' }).fill('(11) 98888-7777')
    await page.getByRole('textbox', { name: 'Mensagem' }).fill('Mensagem de teste automatizado — pode ser ignorada.')
    await page.getByRole('checkbox', { name: /Concordo com o uso dos meus dados/ }).check()
    await page.waitForTimeout(3100) // tempo mínimo antispam
    await page.getByRole('button', { name: 'Enviar mensagem' }).click()
    await expect(page.getByRole('heading', { name: 'Mensagem recebida!' })).toBeVisible()

    const payload = await getPayload({ config: await config })
    const { docs } = await payload.find({ collection: 'inquiries', where: { email: { equals: email } }, depth: 0 })
    expect(docs).toHaveLength(1)
    expect(docs[0].tripTitle).toContain('Europa Sagrada')
    expect(docs[0].consent).toBe(true)
    expect(['enviado', 'pendente', 'falhou']).toContain(docs[0].emailDelivery)
    await payload.delete({ collection: 'inquiries', id: docs[0].id })
  })
})
