import { useEffect, useState } from 'react';

/**
 * Hook to check if component is mounted (client-side)
 * Prevents hydration mismatches with wallet connection state
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
