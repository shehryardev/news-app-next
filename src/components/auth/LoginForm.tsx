import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleSignInButton } from "./GoogleSignInButton";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-app-card border-app-border">
      <CardHeader className="text-center">
        <CardTitle className="text-app-text-primary">Welcome back</CardTitle>
        <CardDescription className="text-app-text-secondary">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-app-text-primary">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="bg-app-background border-app-border text-app-text-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-app-text-primary">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="bg-app-background border-app-border text-app-text-primary"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-app-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-app-card px-2 text-app-text-muted">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-4">
            <GoogleSignInButton
              onSuccess={() => navigate(from, { replace: true })}
              disabled={loading}
            />
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-app-text-secondary">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-app-accent hover:text-app-accent/80"
            >
              Sign up
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
