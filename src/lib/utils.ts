import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000'

export function getStorageUrl(value?: string | null) {
  if (!value) return undefined
  if (value.startsWith('http://') || value.startsWith('https://')) return value
  if (value.startsWith('/')) return `${API_BASE_URL}${value}`
  return `${API_BASE_URL}/storage/${value}`
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
