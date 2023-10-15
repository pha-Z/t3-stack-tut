import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// py-2 px-2   ->   p-2
export default function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
