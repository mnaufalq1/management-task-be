import React, { useState } from 'react';
import { User, Lock, Mail, Eye, EyeOff, CheckSquare, Sparkles, Building2, ArrowRight } from 'lucide-react';
import { loginUser as storageLogin, registerUser as storageRegister } from '../services/storageService';
import { api } from '../services/api';
import { User as UserType } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (user: UserType) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('budi@gmail.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (!email || !password || password.length < 6) {
          setError('Email dan Kata Sandi (minimal 6 karakter) wajib diisi.');
          setLoading(false);
          return;
        }
        const defaultTeam = 'Tim Saya';
        const user = await api.register(email, name, defaultTeam);
        storageRegister(name, email, defaultTeam);
        onLoginSuccess(user);
      } else {
        if (!email) {
          setError('Silakan masukkan email Anda.');
          setLoading(false);
          return;
        }
        const user = await api.login(email, password);
        storageLogin(email, password);
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menghubungkan ke server.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    try {
      const user = await api.login('budi@gmail.com', 'password123');
      storageLogin('budi@gmail.com', 'password123');
      onLoginSuccess(user);
    } catch {
      const res = storageLogin('budi@gmail.com', 'password123');
      if (res.user) onLoginSuccess(res.user);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] text-[#2A1B17] flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Decorative Wavy Background Sweeps */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#7A1C28]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] bg-[#5C121D]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-10">
        
        {/* Left Side: Hero Section */}
        <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#5C121D] via-[#7A1C28] to-[#9C2B3C] p-0.5 shadow-lg shadow-[#4A0E17]/20">
              <div className="w-full h-full bg-[#4A0E17] rounded-[10px] flex items-center justify-center">
                <div className="relative flex items-center justify-center text-white font-black text-2xl tracking-tighter">
                  M
                  <CheckSquare className="w-4 h-4 text-amber-300 absolute -bottom-1 -right-1 stroke-[3]" />
                </div>
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-extrabold text-[#2A1B17] tracking-tight">Mata</span>
              <span className="text-3xl font-bold text-[#7A1C28]">App</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-[#2A1B17]">
            Simplify Your Task Management,{' '}
            <span className="bg-gradient-to-r from-[#5C121D] via-[#7A1C28] to-[#9C2B3C] bg-clip-text text-transparent">
              Streamline Workflow
            </span>
            , and Achieve Project Goals Faster.
          </h1>

          {/* Subtitle / Paragraph */}
          <div className="space-y-4 text-[#544238] text-base sm:text-lg leading-relaxed font-normal">
            <p>
              MataApp simplifies project management so your team can focus on delivering great results without the hassle. Organize tasks, track progress in real time, and eliminate communication bottlenecks effortlessly.
            </p>
            <p className="font-semibold text-[#2A1B17]">
              Ready to transform the way you work? Sign in now and take control of your tasks!
            </p>
          </div>

          {/* Feature Highlight Pills */}
          <div className="pt-2 flex flex-wrap gap-3">
            <div className="px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#E6DCCF] text-[#4A0E17] text-xs sm:text-sm font-semibold shadow-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7A1C28]" /> Real-time Chart Analytics
            </div>
            <div className="px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#E6DCCF] text-[#4A0E17] text-xs sm:text-sm font-semibold shadow-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#7A1C28]" /> Isolasi Data Tim Secure
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form Card */}
        <div className="lg:col-span-5">
          <div className="bg-[#FFFFFF] border border-[#DFD3C3] rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#4A0E17]/10 relative">
            
            {/* Header Titles */}
            <div className="text-center space-y-1 mb-6">
              <h2 className="text-xl sm:text-2xl font-light text-[#8C7769] tracking-wide">
                Selamat Datang
              </h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#2A1B17]">
                {isSignUp ? 'Daftar Akun Baru' : 'Masuk'}
              </h3>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm text-center font-medium">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-1">
                  <label className="text-xs text-[#2A1B17] font-semibold ml-1">Nama Lengkap</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7769]" />
                    <input
                      type="text"
                      placeholder="Contoh: Budi Pratama"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#FAF6F0] border border-[#DFD3C3] rounded-full py-3 left-10 pl-11 pr-4 text-sm text-[#2A1B17] placeholder-[#8C7769] focus:outline-none focus:border-[#7A1C28] focus:ring-1 focus:ring-[#7A1C28] transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-xs text-[#2A1B17] font-semibold ml-1">Alamat Email</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7769]" />
                  <input
                    type="email"
                    placeholder="budi@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#FAF6F0] border border-[#DFD3C3] rounded-full py-3 pl-11 pr-4 text-sm text-[#2A1B17] placeholder-[#8C7769] focus:outline-none focus:border-[#7A1C28] focus:ring-1 focus:ring-[#7A1C28] transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-xs text-[#2A1B17] font-semibold ml-1">Kata Sandi</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7769]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimal 8 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#FAF6F0] border border-[#DFD3C3] rounded-full py-3 pl-11 pr-11 text-sm text-[#2A1B17] placeholder-[#8C7769] focus:outline-none focus:border-[#7A1C28] focus:ring-1 focus:ring-[#7A1C28] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C7769] hover:text-[#2A1B17] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Checkbox options & Forgot password link */}
              {!isSignUp && (
                <div className="flex items-center justify-between text-xs text-[#8C7769] pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-[#DFD3C3] bg-[#FAF6F0] text-[#7A1C28] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    Remember Me
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Fitur reset kata sandi telah dikirim ke email terdaftar Anda.')}
                    className="italic text-[#7A1C28] hover:underline transition-all cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#5C121D] via-[#7A1C28] to-[#9C2B3C] hover:from-[#4A0E17] hover:to-[#832030] text-white font-semibold text-sm shadow-md shadow-[#4A0E17]/20 transition-all duration-300 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? 'Daftar Sekarang' : 'Log in'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Toggle Sign up / Login */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                  }}
                  className="text-xs text-[#8C7769] hover:text-[#2A1B17] transition-colors cursor-pointer"
                >
                  {isSignUp ? (
                    <>Sudah punya akun? <span className="font-semibold text-[#7A1C28] underline ml-1">Masuk</span></>
                  ) : (
                    <>or <span className="font-semibold text-[#7A1C28] underline ml-1">Sign up</span></>
                  )}
                </button>
              </div>

              {/* Demo Account Button for easy testing */}
              <div className="pt-3 border-t border-[#EFE8DC] text-center">
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2 px-4 rounded-xl bg-[#FAF6F0] hover:bg-[#F3EBE0] border border-[#E6DCCF] text-xs text-[#4A0E17] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#7A1C28]" />
                  Masuk Instan Demo Akun (budi@gmail.com)
                </button>
              </div>
            </form>

            {/* Copyright Footer */}
            <div className="mt-8 pt-4 text-center border-t border-[#EFE8DC] text-[11px] text-[#8C7769] font-light tracking-wide">
              © 2028 MataApp. All Right Reserved
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
