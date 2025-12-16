// Export types from Prisma
export type { User, Project } from "@prisma/client";

// Add custom application types here
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}
