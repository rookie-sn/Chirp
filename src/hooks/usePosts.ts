import { usePostContext } from '../context/PostContext';

// Simple hook to access post context
export function usePosts() {
  return usePostContext();
}
