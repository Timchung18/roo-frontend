import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getInitials(firstName, lastName) {
  const firstInitial = firstName ? firstName[0].toUpperCase() : '';
  const lastInitial = lastName ? lastName[0].toUpperCase() : '';
  return firstInitial + lastInitial;
}

export function formatDate(dateString, showWeekday = false) {
  const date = new Date(dateString + 'T00:00:00Z'); // Ensure the date is treated as UTC
  return date.toLocaleDateString('en-US', {
    weekday: showWeekday ? 'long' : undefined,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });
}

export function formatToISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}