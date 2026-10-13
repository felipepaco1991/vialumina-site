import { formatDateRange } from './format'

/** Link oficial do WhatsApp (wa.me) com mensagem pré-preenchida. */
export function whatsappUrl(phone: string, text?: string): string {
  const digits = phone.replace(/\D/g, '')
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}

/** Mensagem contextualizada para uma peregrinação. */
export function tripWhatsappMessage(trip: { title: string; startDate: string | null; endDate: string | null; departureCity?: string | null }): string {
  const when = trip.startDate ? `, com saída em ${formatDateRange(trip.startDate, trip.endDate)}` : ''
  return `Olá! Gostaria de receber mais informações sobre a peregrinação ${trip.title}${when}.`
}
