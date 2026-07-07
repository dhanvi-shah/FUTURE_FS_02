import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { loginSchema, type LoginFormData } from '../schemas';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const Blob = ({ className, delay }: { className: string; delay: number }) => (
  <motion.div
    className={className}
    animate={{
      scale: [1, 1.2, 1],
      x: [0, 30, 0],
      y: [0, -20, 0],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay,
      ease: 'easeInOut',
    }}
  />
);

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: true },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      <Blob className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl" delay={0} />
      <Blob className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-cyan/15 rounded-full blur-3xl" delay={2} />
      <Blob className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-3xl" delay={4} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-[24px] p-8 shadow-2xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center shadow-lg shadow-purple-500/30"
          >
            <span className="text-2xl font-bold text-white">M</span>
          </motion.div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold gradient-text mb-2">Welcome back</h1>
            <p className="text-sm text-text-secondary">Sign in to your Mini CRM dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="admin@crm.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-text-muted hover:text-text-primary transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border bg-background text-accent-purple focus:ring-accent-purple"
                  {...register('remember')}
                />
                <span className="text-sm text-text-secondary">Remember me</span>
              </label>
              <button type="button" className="text-sm text-accent-purple hover:text-accent-blue transition-colors">
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-text-muted">
            Demo: admin@crm.com / password123
          </p>
        </div>
      </motion.div>
    </div>
  );
};
