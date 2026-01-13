import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getCurrentUser } from "aws-amplify/auth";
import {
  extractUserId,
  extractUserEmail,
  extractUsername,
} from "../utils/authUser";
import { AmplifyUser } from "../types/models";

export interface AuthContextValue {
  user: AmplifyUser | null;
  userId: string | null;
  username: string | null;
  email: string | null;
  setUser: (user: AmplifyUser | null) => void;
  checkingAuth: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthContext.Provider");
  }
  return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AmplifyUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        // @ts-ignore - Amplify types can be tricky, trusting our model
        setUser(currentUser as AmplifyUser);
      } catch {
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkCurrentUser();
  }, []);

  const userId = extractUserId(user);
  const email = extractUserEmail(user);
  const username = extractUsername(user);

  const value: AuthContextValue = {
    user,
    userId,
    username,
    email,
    setUser,
    checkingAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
