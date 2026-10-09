'use client'
import { useRowLabel } from '@payloadcms/ui'

/** Mostra "Dia 3 (07/out) – FÁTIMA" no lugar de "Dia 03" na lista do itinerário. */
export function DayRowLabel() {
  const { data, rowNumber } = useRowLabel<{ day?: number; dateLabel?: string; route?: string }>()
  const day = data?.day ?? (rowNumber ?? 0) + 1
  return (
    <span>
      Dia {day}
      {data?.dateLabel ? ` (${data.dateLabel})` : ''}
      {data?.route ? ` – ${data.route}` : ''}
    </span>
  )
}
