import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination or default to home
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    // If user is already authenticated, redirect them
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // If loading or already authenticated, show nothing or a loading state
  if (isAuthenticated) {
    return null;
  }

  const handleSwitchToRegister = () => setMode("register");
  const handleSwitchToLogin = () => setMode("login");

  return (
    <div className="min-h-screen bg-app-background dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header with logo/brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-app-text-primary mb-2">
            DevNews
          </h1>
          <p className="text-app-text-secondary">
            Stay updated with the latest in tech
          </p>
        </div>

        {/* Auth Forms */}
        <div className="space-y-4">
          {mode === "login" ? (
            <LoginForm onSwitchToRegister={handleSwitchToRegister} />
          ) : (
            <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
          )}
        </div>

        {/* Mode Toggle Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          <Button
            variant={mode === "login" ? "default" : "outline"}
            onClick={() => setMode("login")}
            className="min-w-[100px]"
          >
            Sign In
          </Button>
          <Button
            variant={mode === "register" ? "default" : "outline"}
            onClick={() => setMode("register")}
            className="min-w-[100px]"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
