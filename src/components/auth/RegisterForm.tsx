import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return;
    }

    setLoading(true);
    const success = await register(email, password);
    
    if (success) {
      onSwitchToLogin();
    }
    
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-app-card border-app-border">
      <CardHeader className="text-center">
        <CardTitle className="text-app-text-primary">Create account</CardTitle>
        <CardDescription className="text-app-text-secondary">
          Sign up to start discovering amazing content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-app-text-primary">Email</Label>
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
            <Label htmlFor="password" className="text-app-text-primary">Password</Label>
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
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-app-text-primary">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className="bg-app-background border-app-border text-app-text-primary"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-app-primary text-app-primary-foreground hover:bg-app-primary/90"
            disabled={loading || password !== confirmPassword}
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-app-text-secondary">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-app-primary hover:text-app-primary/80"
            >
              Sign in
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}