import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiService, UserResponse } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserResponse | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (token: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated on app start
    const checkAuth = async () => {
      const isAuth = apiService.isAuthenticated();
      if (isAuth) {
        try {
          const userData = await apiService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          // Token might be invalid, clear it
          localStorage.removeItem("access_token");
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await apiService.login({ username: email, password });
      const userData = await apiService.getCurrentUser();
      setIsAuthenticated(true);
      setUser(userData);
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in.",
      });
      return true;
    } catch (error) {
      console.log(error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const loginWithGoogle = async (token: string): Promise<boolean> => {
    try {
      await apiService.loginWithGoogle(token);
      const userData = await apiService.getCurrentUser();
      setIsAuthenticated(true);
      setUser(userData);
      toast({
        title: "Welcome!",
        description: "You've been successfully logged in with Google.",
      });
      return true;
    } catch (error) {
      toast({
        title: "Google login failed",
        description: "Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      await apiService.register({ email, password });
      toast({
        title: "Account created!",
        description: "Please log in with your credentials.",
      });
      return true;
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again with different credentials.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    apiService.logout();
    setIsAuthenticated(false);
    setUser(null);
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        loginWithGoogle,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
