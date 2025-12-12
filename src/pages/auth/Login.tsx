import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icons } from '../../components/icons';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Demo login credentials for easy testing
  const demoCredentials = [
    { role: 'NGO', email: 'ngo@helpindia.org', password: 'password123', color: 'bg-blue-500' },
    { role: 'NGO Admin', email: 'ngoadmin@helpindia.org', password: 'password123', color: 'bg-indigo-500' },
    { role: 'NGO Manager', email: 'ngomanager@helpindia.org', password: 'password123', color: 'bg-green-500' },
    { role: 'Volunteer', email: 'volunteer@helpindia.org', password: 'password123', color: 'bg-orange-500' },
    { role: 'Donor', email: 'donor@example.com', password: 'password123', color: 'bg-red-500' },
    { role: 'Citizen', email: 'citizen@example.com', password: 'password123', color: 'bg-teal-500' }
  ];

  const handleQuickLogin = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back! Login successful.');
      
      // Add a small delay to ensure state is updated before navigation
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
    } catch (err) {
      toast.error((err as Error).message || 'Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="hidden md:block space-y-6">
            <Link to="/" className="inline-block">
              <h1 className="text-6xl font-bold mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Seva</span>
                <span className="text-gray-900">Daan</span>
              </h1>
            </Link>
            <h2 className="text-4xl font-bold leading-tight text-gray-900">
              Transform Lives,<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Create Impact</span>
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Join thousands of volunteers and NGOs making a difference in communities across India.
            </p>
            <div className="flex gap-6 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">500+</div>
                <div className="text-sm text-gray-600">Active NGOs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">10K+</div>
                <div className="text-sm text-gray-600">Volunteers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">200+</div>
                <div className="text-sm text-gray-600">Programs</div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="space-y-6">
            {/* Mobile Header */}
            <div className="text-center md:hidden mb-8">
              <Link to="/" className="inline-block">
                <h1 className="text-4xl font-bold">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Seva</span>
                  <span className="text-gray-900">Daan</span>
                </h1>
              </Link>
            </div>

            <Card className="shadow-2xl bg-white border-0">
              <CardContent className="p-8">
                {/* Header */}
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-2">Welcome Back</h2>
                  <p className="text-gray-600">Sign in to continue your journey</p>
                </div>

                {/* Demo Credentials Section */}
                <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border border-blue-100 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center text-sm">
                    <Icons.lock className="w-4 h-4 mr-2" />
                    Quick Login
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {demoCredentials.map((cred, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickLogin(cred.email, cred.password)}
                        className="text-left p-2 rounded-lg border border-blue-100 bg-white hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${cred.color} group-hover:scale-125 transition-transform`}></div>
                          <span className="font-medium text-gray-700 text-xs">{cred.role}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Login Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Icons.email className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          autoComplete="email"
                          required
                          className="block w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Icons.lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          required
                          className="block w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          {showPassword ? <Icons.hide className="h-5 w-5" /> : <Icons.view className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <a href="#" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                        Forgot password?
                      </a>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white py-3.5 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed border-0"
                    isLoading={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Signing in...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Icons.arrowRight className="w-5 h-5 mr-2" />
                        Sign In to Dashboard
                      </div>
                    )}
                  </Button>
                </form>

                {/* Register Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link 
                      to="/register" 
                      className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
                    >
                      Create one now
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;