import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, User, Mail, Eye, EyeOff } from 'lucide-react';
import { useUserStore } from '@/lib/store/user';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { signInWithEmail, signUpWithEmail, loginAnonymous, isLoading, error, setError } = useUserStore();
  
  // State for forms
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'anonymous'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '', 
    nickname: '' 
  });

  // Clear errors when modal opens
  useEffect(() => {
    if (open) {
      setLoginError(null);
      setError(null);
    }
  }, [open, setError]);

  const clearError = () => {
    setLoginError(null);
    setError(null);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();
    
    try {
      console.log('🔐 Starting email login...');
      await signInWithEmail(loginForm.email, loginForm.password);
      console.log('✅ Email login successful, closing modal...');
      onOpenChange(false);
    } catch (err: any) {
      console.error('❌ Email login failed:', err);
      setLoginError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();
    
    if (signupForm.password !== signupForm.confirmPassword) {
      setLoginError('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    if (signupForm.password.length < 6) {
      setLoginError('Password must be at least 6 characters long.');
      setIsSubmitting(false);
      return;
    }

    if (signupForm.nickname.trim().length < 2) {
      setLoginError('Nickname must be at least 2 characters long.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      console.log('📝 Starting email signup...');
      await signUpWithEmail(
        signupForm.email,
        signupForm.password,
        signupForm.nickname,
        'calm_fox', // Default avatar
        'anxiety', // Default topic
        { sessionMode: 'chat_only', aiModeratorPersona: 'calm_listener' }
      );
      console.log('✅ Email signup successful, closing modal...');
      onOpenChange(false);
    } catch (err: any) {
      console.error('❌ Email signup failed:', err);
      setLoginError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setIsSubmitting(true);
    clearError();
    
    try {
      const nickname = `Guest${Math.floor(Math.random() * 10000)}`;
      const avatar = 'calm_fox';
      const topic = 'anxiety';
      const preferences = { sessionMode: 'chat_only', aiModeratorPersona: 'calm_listener' };
      
      console.log('👤 Starting anonymous login...');
      await loginAnonymous(nickname, avatar, topic, preferences);
      console.log('✅ Anonymous login successful, closing modal...');
      onOpenChange(false);
    } catch (err: any) {
      console.error('❌ Anonymous login failed:', err);
      setLoginError(err.message || 'Anonymous login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" /> Welcome to unmute
          </DialogTitle>
          <DialogDescription>
            Sign in to your account or join anonymously to get started.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="anonymous">Anonymous</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full flex items-center gap-2"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                Sign In
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-nickname">Nickname</Label>
                <Input
                  id="signup-nickname"
                  type="text"
                  placeholder="Choose a nickname"
                  value={signupForm.nickname}
                  onChange={(e) => setSignupForm(prev => ({ ...prev, nickname: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password (min 6 characters)"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  value={signupForm.confirmPassword}
                  onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full flex items-center gap-2"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                Create Account
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="anonymous" className="space-y-4">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground text-sm">
                Join anonymously to explore unmute without creating an account. You'll get a random nickname and can start chatting right away.
              </p>
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={handleAnonymousLogin}
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <User className="h-4 w-4" />}
                Join Anonymously
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {(loginError || error) && (
          <div className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-md">
            {loginError || error}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 