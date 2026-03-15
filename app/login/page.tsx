'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLoginMutation } from '@/store/api/authApi';

export default function LoginPage() {
  const [isArabic, setIsArabic] = useState(true); // Arabic as default language
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const [login, { isLoading }] = useLoginMutation();

  const t = {
    title: isArabic ? 'لوحة تحكم المشرف' : 'Admin Dashboard',
    subtitle: isArabic ? 'مرحباً بعودتك إلى جولد نت' : 'Welcome back to GoldNet',
    email: isArabic ? 'البريد الإلكتروني' : 'Email Address',
    emailPlaceholder: isArabic ? 'أدخل بريدك الإلكتروني' : 'Enter your email',
    password: isArabic ? 'كلمة المرور' : 'Password',
    passwordPlaceholder: isArabic ? 'أدخل كلمة المرور' : 'Enter your password',
    forgotPassword: isArabic ? 'نسيت كلمة المرور؟' : 'Forgot password?',
    signIn: isArabic ? 'تسجيل الدخول' : 'Sign In',
    required: '*',
    errorEmail: isArabic ? 'البريد الإلكتروني مطلوب' : 'Email is required',
    errorEmailInvalid: isArabic ? 'البريد الإلكتروني غير صحيح' : 'Invalid email format',
    errorPassword: isArabic ? 'كلمة المرور مطلوبة' : 'Password is required',
    errorLogin: isArabic ? 'بريد إلكتروني أو كلمة مرور غير صحيحة' : 'Invalid email or password',
  };

  const toggleLanguage = () => {
    setIsArabic(!isArabic);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = t.errorEmail;
    } else if (!validateEmail(email)) {
      newErrors.email = t.errorEmailInvalid;
    }

    if (!password.trim()) {
      newErrors.password = t.errorPassword;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const result = await login({ email, password }).unwrap();
        router.push('/dashboard');
      } catch (err: any) {
        setErrors({ general: err?.data?.message || t.errorLogin });
      }
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 ${isArabic ? 'rtl' : 'ltr'}`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className={`flex items-center ${isArabic ? 'space-x-reverse' : ''} space-x-3`}>
              <div className="bg-gradient-to-br from-amber-400 to-yellow-600 p-2 rounded-lg shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2l2.5 7h7.5l-6 4.5 2.5 7.5-6-4.5-6 4.5 2.5-7.5-6-4.5h7.5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-700 bg-clip-text text-transparent">
                  {isArabic ? 'جولد نت' : 'GoldNet'}
                </h1>
                <p className="text-xs text-gray-600">{isArabic ? 'لوحة تحكم المشرف' : 'Admin Panel'}</p>
              </div>
            </div>
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors"
            >
              {isArabic ? 'English' : 'العربية'}
            </button>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{t.title}</h2>
              <p className="text-gray-600">{t.subtitle}</p>
            </div>

            {errors.general && (
              <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm text-center">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.email} <span className="text-red-500">{t.required}</span>
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isArabic ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full ${isArabic ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-amber-200'
                    }`}
                    placeholder={t.emailPlaceholder}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.password} <span className="text-red-500">{t.required}</span>
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isArabic ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full ${isArabic ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.password
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-amber-200'
                    }`}
                    placeholder={t.passwordPlaceholder}
                  />
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>

              {/* Forgot Password Link */}
              <div className={`${isArabic ? 'text-left' : 'text-right'}`}>
                <Link
                  href="/forgot-password"
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  {t.forgotPassword}
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all shadow-md hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className={`animate-spin rounded-full h-5 w-5 border-b-2 border-white ${isArabic ? 'ml-2' : 'mr-2'}`}></div>
                    {isArabic ? 'جاري تسجيل الدخول...' : 'Signing in...'}
                  </>
                ) : (
                  t.signIn
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
