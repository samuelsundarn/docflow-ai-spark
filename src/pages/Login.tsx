
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp, user, profile, loading } = useAuth();

  useEffect(() => {
    if (user && profile && !loading) {
      if (profile.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, profile, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await signIn(email, password);
        if (!result.error) {
          toast.success('Successfully signed in!');
        }
      } else {
        if (!fullName.trim()) {
          toast.error('Please enter your full name');
          setIsLoading(false);
          return;
        }
        result = await signUp(email, password, fullName);
        if (!result.error) {
          toast.success('Account created successfully! Please check your email to verify your account.');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fillTestCredentials = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setEmail('admin_demo@docflow.ai');
      setPassword('admin123');
    } else {
      setEmail('user_demo@docflow.ai');
      setPassword('user123');
    }
    setIsLogin(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Parallax Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Geometric Patterns */}
      <div className="absolute inset-0">
        <svg className="absolute top-20 left-20 w-32 h-32 text-blue-200 opacity-30" fill="currentColor" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="50"/>
        </svg>
        <svg className="absolute bottom-20 right-20 w-24 h-24 text-blue-300 opacity-40" fill="currentColor" viewBox="0 0 100 100">
          <polygon points="50,0 100,50 50,100 0,50"/>
        </svg>
        <svg className="absolute top-1/3 right-1/4 w-16 h-16 text-blue-400 opacity-20" fill="currentColor" viewBox="0 0 100 100">
          <rect width="100" height="100"/>
        </svg>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">DF</span>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">DocFlow AI</span>
            </Link>
          </div>

          {/* Test Credentials Card */}
          <div className="bg-white/80 backdrop-blur-lg border border-blue-200 p-4 rounded-xl shadow-lg mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Test Credentials</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => fillTestCredentials('admin')}
                className="text-xs p-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-700 transition-colors"
              >
                <div className="font-medium">Admin Access</div>
                <div className="text-blue-600">admin_demo@docflow.ai</div>
              </button>
              <button
                onClick={() => fillTestCredentials('user')}
                className="text-xs p-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-700 transition-colors"
              >
                <div className="font-medium">User Access</div>
                <div className="text-blue-600">user_demo@docflow.ai</div>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white/80 backdrop-blur-lg border border-blue-200 p-8 rounded-xl shadow-xl">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2 text-blue-900">
                {isLogin ? 'Sign in to your account' : 'Create your account'}
              </h1>
              <p className="text-blue-600">Welcome to DocFlow AI</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-blue-800">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 bg-white/70 border-blue-200 text-blue-900 placeholder:text-blue-400 focus:border-blue-400 focus:ring-blue-400"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-800">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/70 border-blue-200 text-blue-900 placeholder:text-blue-400 focus:border-blue-400 focus:ring-blue-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-800">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-white/70 border-blue-200 text-blue-900 placeholder:text-blue-400 focus:border-blue-400 focus:ring-blue-400"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-3 transition-all duration-300 shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-blue-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-800 hover:underline font-medium"
                >
                  {isLogin ? 'Sign up for free' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-blue-500">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
