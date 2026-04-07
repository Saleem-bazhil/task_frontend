import { createContext, useEffect, useMemo, useState } from "react";

import {
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  updateProfile as updateProfileRequest,
} from "../services/auth";
import { getAccessToken, getStoredUser } from "../services/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      const token = getAccessToken();
      if (!token) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
      } catch {
        logoutRequest();
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    }

    bootstrap();
  }, []);

  const token = getAccessToken();

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user),
      isBootstrapping,
      async login(credentials) {
        const authenticatedUser = await loginRequest(credentials);
        setUser(authenticatedUser);
        return authenticatedUser;
      },
      async register(payload) {
        const registeredUser = await registerRequest(payload);
        setUser(registeredUser);
        return registeredUser;
      },
      logout() {
        logoutRequest();
        setUser(null);
      },
      async updateProfile(payload) {
        const updatedUser = await updateProfileRequest(payload);
        setUser(updatedUser);
        return updatedUser;
      },
    }),
    [isBootstrapping, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
