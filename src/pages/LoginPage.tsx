import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';
import { useAppContext } from '@/contexts/AppContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (isSignup && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        const userId = crypto.randomUUID ? crypto.randomUUID() : (Math.random() * 1e16).toString(36);
        const response = await api.post('/auth/signup', {
          id: userId,
          email: email.trim(),
          password,
          display_name: email.split('@')[0],
        });
        if (response.success) {
          setUser(response.user);
          toast.success('Account created! Welcome.');
          navigate('/');
        } else {
          throw new Error(response.message || 'Signup failed');
        }
      } else {
        const response = await api.post('/auth/login', {
          email: email.trim(),
          password,
        });
        if (response.success) {
          setUser(response.user);
          toast.success('Welcome back!');
          navigate('/');
        } else {
          throw new Error(response.message || 'Login failed');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen min-h-[600px] w-full overflow-hidden font-sans bg-[#1a0b0b]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/login_bg_fruits.jpg"
          alt="Fruits Backdrop"
          className="w-full h-full object-cover"
        />
        {/* Soft Warm Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#2d1410]/80 via-[#2d1410]/20 to-transparent"></div>
      </div>

      {/* Login Container */}
      <div className="relative z-10 flex h-full w-full items-center justify-center md:justify-end px-6 md:px-12 lg:px-32">
        <div className="w-full max-w-md rounded-[3rem] bg-white/10 backdrop-blur-3xl border border-white/20 p-10 md:p-14 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] animate-fade-in-up">
          <div className="mb-0 text-center">
            <h1 className="text-4xl md:text-5xl font-serif italic text-white mb-2 tracking-tight drop-shadow-lg">
              {isSignup ? "Join the family" : "Welcome Home"}
            </h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/50 font-bold mb-10">
              Oven Theory Bakery
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <Label
                htmlFor="email"
                className="text-[11px] uppercase tracking-widest text-white/40 font-bold ml-2 transition-colors group-focus-within:text-white"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="hello@oventheory.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full h-12 rounded-2xl border-none bg-white/10 px-6 text-white placeholder:text-white/20 focus:bg-white/20 focus:ring-1 focus:ring-white/30 transition-all text-sm"
              />
            </div>

            <div className="space-y-2 relative group">
              <Label
                htmlFor="password"
                className="text-[11px] uppercase tracking-widest text-white/40 font-bold ml-2 transition-colors group-focus-within:text-white"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full h-12 rounded-2xl border-none bg-white/10 px-6 text-white placeholder:text-white/20 focus:bg-white/20 focus:ring-1 focus:ring-white/30 transition-all text-sm pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isSignup && (
              <div className="space-y-2 relative animate-in fade-in slide-in-from-top-4 duration-500 group">
                <Label
                  htmlFor="confirmPassword"
                  className="text-[11px] uppercase tracking-widest text-white/40 font-bold ml-2 transition-colors group-focus-within:text-white"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className="w-full h-12 rounded-2xl border-none bg-white/10 px-6 text-white placeholder:text-white/20 focus:bg-white/20 focus:ring-1 focus:ring-white/30 transition-all text-sm pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 mt-8 rounded-full bg-white text-[#2d1410] hover:bg-white/90 font-bold text-sm uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Preparing..." : (isSignup ? "Create Member" : "Enter Bakery")}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setConfirmPassword('');
              }}
              className="text-xs text-white/40 hover:text-white transition-colors tracking-wide"
            >
              {isSignup ? "Already joined? " : "New visitor? "}
              <span className="font-bold border-b border-white/20 pb-0.5 ml-1 hover:border-white transition-all">
                {isSignup ? "Sign In" : "Join Now"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes slow-zoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.15); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 25s ease-in-out infinite alternate;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}} />
    </div>
  );
};

export default LoginPage;
