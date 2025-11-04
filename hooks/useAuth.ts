'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import type { Session } from 'next-auth';

interface UseAuthReturn {
  session: Session | null;
  user: Session['user'] | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: typeof signIn;
  signOut: typeof signOut;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();

  return {
    session,
    user: session?.user,
    isAuthenticated: !!session?.user,
    isLoading: status === 'loading',
    signIn,
    signOut,
  };
}

