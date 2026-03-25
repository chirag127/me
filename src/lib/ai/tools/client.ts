import { QueryClient } from '@tanstack/react-query';

// Singleton query client for backend usage across all tools
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1 hour cache
      retry: 1,
    },
  },
});
