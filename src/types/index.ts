// Export types from Prisma
export type { User } from "../generated/prisma";

// Add custom application types here
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}
