import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useVoting } from '../context/VotingContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { Shield, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { adminLogin } = useVoting();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await adminLogin(username, password);
      
      if (success) {
        toast.success('Welcome back, Administrator!');
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-orange-500/5"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 gradient-secondary rounded-3xl shadow-secondary mb-6 hover-lift">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card shadow-lg mb-4">
            <Sparkles className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-semibold text-gray-700">Secure Admin Access</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Admin Portal</h1>
          <p className="text-lg text-gray-600">Election Management System</p>
        </div>

        <Card className="shadow-2xl border-2 border-gray-200 hover-lift">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Lock className="h-5 w-5 text-white" />
              </div>
              Administrator Login
            </CardTitle>
            <CardDescription className="text-base">
              Enter your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-base">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-12 border-2 focus:border-teal-500 focus:ring-teal-500 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="pr-12 h-12 border-2 focus:border-teal-500 focus:ring-teal-500 text-base"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-teal-600 focus:outline-none transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base gradient-primary shadow-primary hover:shadow-glow text-white border-0" 
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Access Dashboard'}
              </Button>

              <div className="pt-4 border-t">
                <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-4">
                  <p className="text-sm text-gray-700 text-center">
                    <span className="font-semibold text-teal-700">Default credentials:</span>
                    <br />
                    <span className="font-mono font-semibold text-gray-900">admin / admin123</span>
                  </p>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Currently using local authentication
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="hover:bg-white/60 glass-card px-6 py-3"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}