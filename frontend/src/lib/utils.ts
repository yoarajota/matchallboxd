import { AuthContext } from "@/components/contexts/AuthProvider";
import { type ClassValue, clsx } from "clsx"
import { useContext } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useAuth() {
  return useContext(AuthContext);
}