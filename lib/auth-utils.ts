import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';
import type { Session } from 'next-auth';

/**
 * Get the current session on the server
 * Use in Server Components and API routes
 */
export async function getSession(): Promise<Session | null> {
  return await getServerSession(authOptions);
}

/**
 * Get the current user from session
 * Throws error if not authenticated
 */
export async function getCurrentUser() {
  const session = await getSession();

  if (!session?.user) {
    throw new Error('Not authenticated');
  }

  return session.user;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session?.user;
}

