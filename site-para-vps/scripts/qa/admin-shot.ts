/** Capturas do painel administrativo para documentação (usa um usuário temporário). */
import 'dotenv/config'
import { chromium } from '@playwright/test'
import { cleanupTestUser, seedTestUser, testUser } from '../../tests/helpers/seedUser'

const out = process.argv[2] ?? 'admin-shots'
await seedTestUser()
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || 'chrome' })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
await page.goto('http://localhost:3000/admin/login')
await page.fill('#field-email', testUser.email)
await page.fill('#field-password', testUser.password)
await page.click('button[type="submit"]')
await page.waitForURL(/\/admin$/)
await page.waitForTimeout(1500)
await page.screenshot({ path: `${out}/admin-dashboard.png` })
await page.goto('http://localhost:3000/admin/collections/trips')
await page.waitForTimeout(1500)
await page.screenshot({ path: `${out}/admin-trips.png` })
await page.getByText('Egito e Terra Santa').first().click()
await page.waitForTimeout(2000)
await page.screenshot({ path: `${out}/admin-trip-edit.png` })
await page.getByRole('button', { name: 'Programação' }).or(page.getByText('Programação', { exact: true })).first().click()
await page.waitForTimeout(1000)
await page.screenshot({ path: `${out}/admin-trip-itinerary.png` })
await browser.close()
await cleanupTestUser()
process.exit(0)
