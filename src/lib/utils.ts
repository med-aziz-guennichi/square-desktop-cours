import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseUpdateBody(body: string): string[] {
  return body
    .split('-')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}
