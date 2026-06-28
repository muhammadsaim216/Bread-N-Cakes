import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';
import { PageType } from '../types';
import { toast } from '../utils/toast';

interface AuthProps {
  onLogin: (userData: {
    name: string;
    email: string;
    avatar?: string;
    loyaltyPoints: number;
    savedAddresses: any[];
  }) => void;
  setActivePage: (page: PageType) => void;
}

export default function Auth({ onLogin, setActivePage }: AuthProps) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter all required credentials.');
      return;
    }

    if (!isLoginTab && !name) {
      setErrorMsg('Please enter your display name.');
      return;
    }

    // Mock successful authentication
    const displayName = isLoginTab ? 'Samantha Reyes' : name;
    
    onLogin({
      name: displayName,
      email: email.trim().toLowerCase(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      loyaltyPoints: isLoginTab ? 350 : 50, // bonus on signup
      savedAddresses: [
        { id: 'addr-1', label: 'Home Address', street: '452 Elm Street, Apt 3B', city: 'San Francisco', zipCode: '94102' }
      ]
    });

    setActivePage('dashboard');
  };

  const handleSocialMockClick = (provider: string) => {
    onLogin({
      name: 'Samantha Reyes',
      email: 'samantha.reyes@google.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      loyaltyPoints: 120,
      savedAddresses: [
        { id: 'addr-1', label: 'Home Address', street: '452 Elm Street, Apt 3B', city: 'San Francisco', zipCode: '94102' }
      ]
    });
    setActivePage('dashboard');
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8" id="auth-view">
      <div className="rounded-3xl border border-stone-100 bg-white p-6 sm:p-8 shadow-md">
        {/* Tab switcher */}
        <div className="flex border-b border-stone-100 mb-8 pb-3 gap-6 font-serif text-lg font-bold">
          <button
            onClick={() => {
              setIsLoginTab(true);
              setErrorMsg(null);
            }}
            className={`relative pb-2 transition-colors ${
              isLoginTab ? 'text-orange-600' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Log In
            {isLoginTab && (
              <motion.div layoutId="authTabLine" className="absolute bottom-0 left-0 h-0.5 w-full bg-orange-600" />
            )}
          </button>
          <button
            onClick={() => {
              setIsLoginTab(false);
              setErrorMsg(null);
            }}
            className={`relative pb-2 transition-colors ${
              !isLoginTab ? 'text-orange-600' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Sign Up
            {!isLoginTab && (
              <motion.div layoutId="authTabLine" className="absolute bottom-0 left-0 h-0.5 w-full bg-orange-600" />
            )}
          </button>
        </div>

        {/* Errors */}
        {errorMsg && (
          <div className="rounded-xl bg-red-50 p-3 mb-6 font-sans text-xs font-semibold text-red-600 border border-red-100">
            {errorMsg}
          </div>
        )}

        {/* Main form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          {/* Name - Register only */}
          {!isLoginTab && (
            <div className="space-y-1">
              <label className="font-semibold text-stone-700">Display Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Samantha R."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 outline-none focus:border-orange-500 bg-stone-50/50 focus:bg-white"
                />
                <User size={14} className="absolute left-3.5 top-3.5 text-stone-400" />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label className="font-semibold text-stone-700">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="samantha@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 outline-none focus:border-orange-500 bg-stone-50/50 focus:bg-white"
              />
              <Mail size={14} className="absolute left-3.5 top-3.5 text-stone-400" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-stone-700">Password</label>
              {isLoginTab && (
                <button
                  type="button"
                  onClick={() => toast.info('Password reset directions dispatched to mock email inbox.')}
                  className="text-[10px] font-semibold text-orange-600 hover:underline"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-10 outline-none focus:border-orange-500 bg-stone-50/50 focus:bg-white"
              />
              <Lock size={14} className="absolute left-3.5 top-3.5 text-stone-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-700"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-1.5 rounded-full bg-stone-900 py-3.5 font-sans font-bold text-white hover:bg-orange-600 transition-colors cursor-pointer"
          >
            {isLoginTab ? <LogIn size={14} /> : <UserPlus size={14} />}
            <span>{isLoginTab ? 'Access Account' : 'Register Account'}</span>
          </button>
        </form>

        {/* Social login divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-100" />
          </div>
          <span className="relative bg-white px-3 font-mono text-[9px] uppercase tracking-widest text-stone-400">
            or continue with
          </span>
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSocialMockClick('Google')}
            className="flex items-center justify-center space-x-2 rounded-xl border border-stone-200 py-2.5 font-sans text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
          >
            <span>Google</span>
          </button>
          <button
            onClick={() => handleSocialMockClick('Apple')}
            className="flex items-center justify-center space-x-2 rounded-xl border border-stone-200 py-2.5 font-sans text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
          >
            <span>Apple Pay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
