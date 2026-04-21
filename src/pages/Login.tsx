import { useState, useEffect } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
  const { user, login, loginWithEmail, signupWithEmail } = useAuth();
  const location = useLocation();
  
  const [isLoginView, setIsLoginView] = useState(location.pathname !== '/signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsLoginView(location.pathname !== '/signup');
  }, [location.pathname]);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginView) {
        await loginWithEmail(email, password);
      } else {
        if (!name) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }
        await signupWithEmail(email, password, name);
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Try signing in.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'An error occurred during authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex">
      {/* Left side - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 flex-col justify-center items-center relative overflow-hidden p-12">
        <div className="absolute top-0 right-0 -m-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[80px] opacity-70"></div>
        <div className="absolute bottom-0 left-0 -m-32 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[80px] opacity-70"></div>
        
        <div className="relative z-10 text-white max-w-lg">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-1.5 rounded-full text-sm font-medium border border-blue-400 mb-8 backdrop-blur-md">
            <BookOpen className="h-4 w-4 text-blue-200" />
            <span>JambPrep Gateway</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
             Master your <br/>JAMB examination
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed mb-12">
            Join thousands of Nigerian students who are identifying their weak subjects and destroying their CBT anxieties using our comprehensive, realistic mock application.
          </p>
          
          <div className="flex -space-x-4">
            <div className="w-12 h-12 rounded-full border-2 border-blue-600 bg-blue-400 flex items-center justify-center font-bold text-sm">JS</div>
            <div className="w-12 h-12 rounded-full border-2 border-blue-600 bg-indigo-400 flex items-center justify-center font-bold text-sm">AM</div>
            <div className="w-12 h-12 rounded-full border-2 border-blue-600 bg-emerald-400 flex items-center justify-center font-bold text-sm">TO</div>
            <div className="w-12 h-12 rounded-full border-2 border-blue-600 bg-gray-900 flex items-center justify-center font-bold text-xs">+10k</div>
          </div>
          <p className="text-sm font-medium text-blue-200 mt-4">Over 10,000 active students already practicing.</p>
        </div>
      </div>

      {/* Right side - Login/Signup form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 lg:px-24">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors absolute top-8">
           ← Back to Homepage
        </Link>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {isLoginView ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              {isLoginView ? 'Please enter your details to sign in.' : 'Start your journey to admission today.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLoginView && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    required={!isLoginView}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    placeholder="Samuel Abede"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  placeholder="student@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLoginView ? 'Sign Into Account' : 'Create Account'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-[#FBFBFA] text-gray-500 font-medium tracking-wide">OR CONTINUE WITH</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={login}
                className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-sm text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 focus:outline-none transition-colors"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 mr-3" alt="Google logo" />
                Google
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-600">
            {isLoginView ? 'Don\'t have an account? ' : 'Already have an account? '}
            <button
              onClick={toggleView}
              className="font-bold text-blue-600 hover:text-blue-500 transition-colors"
            >
              {isLoginView ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
