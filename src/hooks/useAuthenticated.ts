import { useCurrentUser } from './useCurrentUser';

export function useAuthenticated() {
  const currentUser = useCurrentUser();
  return !!currentUser;
}
