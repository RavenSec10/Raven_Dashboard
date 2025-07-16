'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { Github, Mail, Eye, EyeOff, User, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register');
      }
      
      toast.success('Registration successful! Logging you in...');
      const result = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push(result?.url ?? callbackUrl);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleOAuthSignIn = (provider: 'google' | 'github') => {
    signIn(provider, { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-red-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-red-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-red-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen transform translate-x-0 lg:-translate-x-[60px] xl:-translate-x-[80px]">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8 xl:px-16">
          <div className="mx-auto max-w-sm xl:max-w-md">
            <div className="flex items-center mb-8">
                <div className="flex h-16 w-16 items-center justify-center">
                  <img 
                    src="/ravensec-logo.png" 
                    alt="RavenSec Logo" 
                    className="h-24 w-24 object-contain"
                  />
                </div>
                <div className="ml-4">
                  <h1 className="text-4xl font-bold text-white"><span className='text-red-500'>Raven</span>Sec</h1>
                  <p className="text-lg text-slate-400">API Security Intelligence</p>
                </div>
             </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white leading-tight">
                Join the Elite Security Teams.
                <span className="block text-red-400 mt-2">
                  Protect What Matters Most.
                </span>
              </h2>
              
              <p className="text-slate-300 text-lg leading-relaxed">
                Start your journey with advanced API security monitoring and threat detection.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center text-sm text-slate-300">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                  Real-time threat detection and monitoring
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                  Advanced API security analytics
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                  Enterprise-grade protection
                </div>
              </div>
              
              <div className="flex items-center text-sm text-slate-400">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-red-500 rounded-full border-2 border-slate-800"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full border-2 border-slate-800"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-full border-2 border-slate-800"></div>
                </div>
                <span className="ml-3">Join 500+ security professionals</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Sign up form */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-16 xl:px-20">
          <div className="mx-auto w-full max-w-md xl:max-w-lg">
            {/* Mobile branding */}
            <div className="lg:hidden mb-8 text-center">
              <div className="mx-auto mb-4">
                <img 
                  src="/ravensec-logo.png" 
                  alt="RavenSec Logo" 
                  className="h-12 w-12 mx-auto object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-white">RavenSec</h1>
            </div>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-xl shadow-2xl">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-white text-center">
                  Create an account
                </CardTitle>
                <CardDescription className="text-slate-400 text-center">
                  Enter your details below to get started
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleOAuthSignIn('github')}
                    className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white h-11 transition-all duration-200 hover:scale-105"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleOAuthSignIn('google')}
                    className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white h-11 transition-all duration-200 hover:scale-105"
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-800 px-3 text-slate-400 font-medium">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Full name
                    </label>
                    <div className="relative">
                      <Input
                        {...register('name')}
                        type="text"
                        placeholder="Enter your full name"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 h-11 pl-4 pr-4 focus:border-red-500 focus:ring-red-500/20 transition-all duration-200"
                      />
                      <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                    {errors.name && (
                      <p className="text-red-400 text-sm">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Email address
                    </label>
                    <div className="relative">
                      <Input
                        {...register('email')}
                        type="email"
                        placeholder="Enter your email"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 h-11 pl-4 pr-4 focus:border-red-500 focus:ring-red-500/20 transition-all duration-200"
                      />
                      <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-sm">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 h-11 pl-4 pr-10 focus:border-red-500 focus:ring-red-500/20 transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-sm">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-red-500 focus:ring-red-500 focus:ring-offset-slate-800"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="text-slate-300">
                        I agree to the{' '}
                        <button
                          type="button"
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Terms of Service
                        </button>{' '}
                        and{' '}
                        <button
                          type="button"
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Privacy Policy
                        </button>
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white h-11 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating account...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        Create account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </form>

                <p className="text-center text-sm text-slate-400">
                  Already have an account?{' '}
                  <button
                    onClick={() => router.push('/sign-in')}
                    className="text-red-400 hover:text-red-300 font-medium transition-colors cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              </CardContent>
            </Card>

            <p className="mt-8 text-center text-xs text-slate-500">
              By creating an account, you agree to our{' '}
              <button className="text-red-400 hover:text-red-300 transition-colors">
                Terms of Service
              </button>{' '}
              and{' '}
              <button className="text-red-400 hover:text-red-300 transition-colors">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .bg-grid-white\/\[0\.02\] {
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
}