import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge({
  extend: { classGroups: { 'font-family': [{ font: ['display', 'sans', 'label'] }] } },
})

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
