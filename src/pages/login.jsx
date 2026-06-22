import React, { useState, useContext, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AppContext } from '../context/AppContext';
import { Sparkles, Mail, Lock, User, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const router = useRouter();
  const { login, register, user, authLoading } = useContext(AppContext);

  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/admin');
    }
  }, [user, authLoading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitLoading(true);

    const { name, email, password } = formData;

    try {
      if (isLoginView) {
        if (!email || !password) {
          setErrorMsg('Please fill in email and password.');
          setSubmitLoading(false);
          return;
        }
        const res = await login(email, password);
        if (res.success) {
          router.push('/admin');
        } else {
          setErrorMsg(res.message || 'Invalid email or password.');
        }
      } else {
        if (!name || !email || !password) {
          setErrorMsg('Please fill in all registration fields.');
          setSubmitLoading(false);
          return;
        }
        const res = await register(name, email, password);
        if (res.success) {
          router.push('/admin');
        } else {
          setErrorMsg(res.message || 'Registration failed.');
        }
      }
    } catch (err) {
      console.error('Auth request error:', err);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Aura Nails Administrative Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
        <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] bg-rosegold/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md glass-card rounded-xl shadow-premium p-6 sm:p-8 space-y-6 relative border-gold/15">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-luxury-gradient flex items-center justify-center border border-gold/40 shadow-gold-glow mx-auto mb-2">
              <Sparkles className="w-6 h-6 text-gold" />
            </div>
            <h2 className="font-serif text-cream font-bold text-2xl tracking-wide uppercase">
              {isLoginView ? 'Admin Login' : 'Admin Register'}
            </h2>
            <p className="text-[10px] text-cream/50 tracking-wider">
              {isLoginView ? 'Access management controls' : 'Create administrative account'}
            </p>
          </div>

          {errorMsg && (
            <div className="flex items-center space-x-2 bg-red-950/40 border border-red-500/30 text-red-200 p-3.5 rounded-md text-xs">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLoginView && (
              <div>
                <label className="text-[10px] text-gold uppercase tracking-wider font-semibold block mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-cream/30" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className="premium-input pl-11"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] text-gold uppercase tracking-wider font-semibold block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-cream/30" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@auranails.com"
                  className="premium-input pl-11"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-gold uppercase tracking-wider font-semibold block mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-cream/30" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="premium-input pl-11"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitLoading}
                className="gold-btn w-full py-4 flex items-center justify-center space-x-2 text-xs uppercase tracking-widest font-bold disabled:opacity-50 cursor-pointer"
              >
                <LogIn className="w-4.5 h-4.5" />
                <span>{submitLoading ? 'Authenticating...' : isLoginView ? 'Log In' : 'Register Admin'}</span>
              </button>
            </div>

          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                setIsLoginView(!isLoginView);
                setErrorMsg('');
              }}
              className="text-[11px] text-cream/40 hover:text-gold transition-colors duration-200 cursor-pointer"
            >
              {isLoginView
                ? "Don't have an admin account? Register here"
                : 'Already have an account? Log in here'}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default Login;
