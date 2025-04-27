import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sanitize = (text: string) =>
  text
    // remove only the triple-backtick markers, keep inner code
    .replace(/```([\s\S]*?)```/g, '$1')
    // remove inline backticks
    .replace(/`([^`]+)`/g, '$1')
    // remove markdown links/images, keep the link text
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // strip headers, bold/italic markers
    .replace(/#+\s*(.*)/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    // collapse all whitespace (including newlines) into single spaces
    .replace(/\s+/g, ' ')
    .trim()
