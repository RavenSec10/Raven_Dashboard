'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { CustomFormField } from '@/components/ui/form';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function SignInPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Signed in successfully!');
      router.push('/profile');
    }
  };

  const handleOAuthSignIn = (provider: 'google' | 'github') => {
    signIn(provider, { callbackUrl: '/profile' });
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <CustomFormField
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              register={register}
              error={errors.email}
              required
            />
            <CustomFormField
              label="Password"
              name="password"
              type="password"
              placeholder="********"
              register={register}
              error={errors.password}
              required
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn('github')}
            >
              GitHub
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn('google')}
            >
              Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
