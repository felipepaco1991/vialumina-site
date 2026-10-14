import { expect, test } from '@playwright/test'
import { cleanupTestUser, seedTestUser, testUser } from '../helpers/seedUser'

test.describe('Painel administrativo', () => {
  test.beforeAll(async () => seedTestUser())
  test.afterAll(async () => cleanupTestUser())

  test('rotas do painel exigem login', async ({ page }) => {
    await page.goto('/admin/collections/trips')
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test('editor acessa as peregrinações e o formulário de edição', async ({ page }) => {
    await page.goto('/admin/login')
    await page.fill('#field-email', testUser.email)
    await page.fill('#field-password', testUser.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/admin$/)
    await page.goto('/admin/collections/trips')
    await expect(page.getByText('Portugal e França').first()).toBeVisible()
    await page.getByText('Egito e Terra Santa').first().click()
    await expect(page.locator('input[name="title"]')).toHaveValue('Egito e Terra Santa')
    for (const tab of ['Programação', 'Valores', 'SEO', 'Migração']) await expect(page.getByRole('button', { name: tab }).or(page.getByText(tab, { exact: true })).first()).toBeVisible()
  })
})
