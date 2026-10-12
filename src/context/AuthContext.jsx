import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || 'Admin',
        });
        setIsAuthenticated(true);
        setLoading(false);
      } else {
        // 2. Check cached demo session
        const cachedDemo = localStorage.getItem('shuktara_admin_demo_user');
        if (cachedDemo) {
          try {
            const parsed = JSON.parse(cachedDemo);
            setUser(parsed);
            setIsAuthenticated(true);
          } catch {
            localStorage.removeItem('shuktara_admin_demo_user');
          }
        }
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || 'Admin',
        });
        setIsAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // 1. Demo Credentials Check (instant access, 0 console network errors)
    if (
      normalizedEmail === 'admin@hotelshuktara.com' &&
      (cleanPassword === 'admin123' || cleanPassword === 'admin')
    ) {
      const demoUser = {
        id: 'admin-hotel-shuktara',
        email: 'admin@hotelshuktara.com',
        name: 'Hotel Shuktara Admin',
      };
      localStorage.setItem('shuktara_admin_demo_user', JSON.stringify(demoUser));
      setUser(demoUser);
      setIsAuthenticated(true);
      return { success: true, user: demoUser };
    }

    // 2. If custom credentials entered, authenticate via Supabase
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password: cleanPassword });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || 'Admin',
        });
        setIsAuthenticated(true);
        return { success: true, user: data.user };
      }
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    }

    return {
      success: false,
      error: 'Invalid email or password. Use demo credentials: admin@hotelshuktara.com / admin123',
    };
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    localStorage.removeItem('shuktara_admin_demo_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
