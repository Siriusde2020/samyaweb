'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, twoFactorCode }),
        });
        const data = await res.json();
        if (data.requires2FA) {
          setShow2FA(true);
        } else if (data.success) {
          window.location.href = '/dashboard';
        } else {
          setError(data.error || 'Login failed');
        }
      } else if (mode === 'register') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        });
        const data = await res.json();
        if (data.success) {
          window.location.href = '/dashboard';
        } else {
          setError(data.error || 'Registration failed');
        }
      } else {
        // Password reset
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (data.success) {
          setError('');
          alert('Password reset email sent!');
        }
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold">
              JS
            </div>
            <span className="text-xl font-bold text-surface-900">JAMStack Builder</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-builder p-8">
          <h1 className="text-2xl font-bold text-surface-900 text-center mb-2">
            {mode === 'login' ? 'Welcome back' : mode === 'register' ? 'Create your account' : 'Reset password'}
          </h1>
          <p className="text-sm text-surface-500 text-center mb-6">
            {mode === 'login' ? 'Sign in to continue building' : mode === 'register' ? 'Start building websites for free' : 'Enter your email to reset your password'}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            )}

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            {mode !== 'forgot' && (
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            )}

            {show2FA && (
              <Input
                label="2FA Code"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="Enter 6-digit code"
                required
              />
            )}

            {mode === 'login' && !show2FA && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-xs text-brand-600 hover:text-brand-700"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" className="w-full" loading={isLoading}>
              {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-surface-500">
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button onClick={() => setMode('register')} className="text-brand-600 font-medium hover:text-brand-700">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => { setMode('login'); setShow2FA(false); }} className="text-brand-600 font-medium hover:text-brand-700">
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-xs text-surface-400 text-center mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
