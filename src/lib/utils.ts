import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getApiUrl = () => {
    if (window.location.origin.includes('cloudworkstations.dev')) {
        return window.location.origin.replace('8083', '3001');
    }
    return 'http://localhost:3001';
};
