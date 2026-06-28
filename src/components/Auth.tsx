import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, User, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { PageType } from '../types';
import { toast } from '../utils/toast';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from 'firebase/auth';

interface AuthProps {
  onLogin: (userData: {
    name: string;
    email: string;
    avatar?: string;
    loyaltyPoints: number;
    savedAddresses: any[];
    token: string;
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
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    if (!email || !password) {
      setErrorMsg('Please enter all required credentials.');
      setIsLoading(false);
      return;
    }

    if (!isLoginTab && !name) {
      setErrorMsg('Please enter your display name.');
      setIsLoading(false);
      return;
    }

    try {
      let userCredential;
      if (isLoginTab) {
        // Real Firebase Sign In
        userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        // Real Firebase Sign Up
        userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(userCredential.user, {
          displayName: name.trim(),
        });
      }

      const firebaseUser = userCredential.user;
      const idToken = await firebaseUser.getIdToken();

      // Synchronize with the PostgreSQL database on our server
      const syncResponse = await fetch('/api/users/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name: firebaseUser.displayName || name || 'Sourdough Enthusiast',
          avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
          loyaltyPoints: isLoginTab ? 0 : 50, // 50 points bonus on registration
        }),
      });

      if (!syncResponse.ok) {
        throw new Error('Could not sync user details with the server.');
      }

      const syncData = await syncResponse.json();
      const dbUser = syncData.user;

      toast.success(
        isLoginTab
          ? `Welcome back, ${dbUser.name || 'Baker'}!`
          : `Account created successfully! +50 Loyalty Points awarded.`
      );

      onLogin({
        name: dbUser.name || 'Sourdough Baker',
        email: dbUser.email,
        avatar: dbUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        loyaltyPoints: dbUser.loyaltyPoints,
        savedAddresses: [
          { id: 'addr-1', label: 'Home Address', street: '452 Elm Street, Apt 3B', city: 'San Francisco', zipCode: '94102' },
        ],
        token: idToken,
      });

      setActivePage('dashboard');
    } catch (err: any) {
      console.error(err);
      let friendlyMessage = err.message;
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        friendlyMessage = 'Invalid email or password credentials.';
      } else if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'This email address is already registered.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'Please provide a valid email address.';
      }
      setErrorMsg(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialGoogleClick = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      // Real Google Authentication Popup
      const userCredential = await signInWithPopup(auth, googleAuthProvider);
      const firebaseUser = userCredential.user;
      const idToken = await firebaseUser.getIdToken();

      // Synchronize with the PostgreSQL database
      const syncResponse = await fetch('/api/users/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name: firebaseUser.displayName || 'Sourdough Enthusiast',
          avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
          loyaltyPoints: 100, // Google login signup welcome bonus
        }),
      });

      if (!syncResponse.ok) {
        throw new Error('Database user synchronization failed.');
      }

      const syncData = await syncResponse.json();
      const dbUser = syncData.user;

      toast.success(`Access authorized! Welcome, ${dbUser.name}!`);

      onLogin({
        name: dbUser.name,
        email: dbUser.email,
        avatar: dbUser.avatar,
        loyaltyPoints: dbUser.loyaltyPoints,
        savedAddresses: [
          { id: 'addr-1', label: 'Home Address', street: '452 Elm Street, Apt 3B', city: 'San Francisco', zipCode: '94102' },
        ],
        token: idToken,
      });

      setActivePage('dashboard');
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      setErrorMsg(err.message || 'Google authorization was canceled or failed.');
    } finally {
      setIsLoading(false);
    }
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
            disabled={isLoading}
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
            disabled={isLoading}
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
                  placeholder="e.g. Samantha Reyes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 outline-none focus:border-orange-500 bg-stone-50/50 focus:bg-white"
                  disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
            className="w-full flex items-center justify-center space-x-1.5 rounded-full bg-stone-900 py-3.5 font-sans font-bold text-white hover:bg-orange-600 transition-colors cursor-pointer disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoginTab ? <LogIn size={14} /> : <UserPlus size={14} />}
            <span>{isLoading ? 'Processing...' : isLoginTab ? 'Access Account' : 'Register Account'}</span>
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
        <div className="w-full">
          <button
            onClick={handleSocialGoogleClick}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2.5 rounded-xl border border-stone-200 bg-stone-50/10 hover:bg-stone-50 py-3.5 font-sans text-xs font-bold text-stone-700 transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
          >
            <Sparkles size={13} className="text-amber-500 animate-pulse" />
            <span>Secure Google Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}
