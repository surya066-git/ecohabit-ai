"use client";

import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { auth } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  getIdToken: () => Promise<string>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isMockMode = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const mockUser = { uid: "mock-user-123", email: "mock@example.com", displayName: "Mock User", getIdToken: async () => "mock-token" } as unknown as User;

  useEffect(() => {
    if (isMockMode) {
      if (localStorage.getItem("mock_logged_in") === "true") {
        setUser(mockUser);
      }
      setLoading(false);
      return () => {};
    }
    return onAuthStateChanged(auth, (nextUser: User | null) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, [isMockMode]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (isMockMode) {
      localStorage.setItem("mock_logged_in", "true");
      setUser({ ...mockUser, email } as unknown as User);
      return;
    }
    await signInWithEmailAndPassword(auth, email, password);
  }, [isMockMode]);

  const register = useCallback(async (email: string, password: string) => {
    if (isMockMode) {
      localStorage.setItem("mock_logged_in", "true");
      setUser({ ...mockUser, email } as unknown as User);
      return;
    }
    await createUserWithEmailAndPassword(auth, email, password);
  }, [isMockMode]);

  const signInWithGoogle = useCallback(async () => {
    if (isMockMode) {
      localStorage.setItem("mock_logged_in", "true");
      setUser(mockUser);
      return;
    }
    await signInWithPopup(auth, new GoogleAuthProvider());
  }, [isMockMode]);

  const signOutUser = useCallback(async () => {
    if (isMockMode) {
      localStorage.removeItem("mock_logged_in");
      setUser(null);
      return;
    }
    await signOut(auth);
  }, [isMockMode]);

  const getIdToken = useCallback(async () => {
    if (isMockMode && user) return "mock-token";
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User is not authenticated.");
    }
    return currentUser.getIdToken();
  }, [isMockMode, user]);

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      register,
      signInWithGoogle,
      signOutUser,
      getIdToken
    }),
    [getIdToken, loading, register, signIn, signInWithGoogle, signOutUser, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
