"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, Home, GitCompare, Info, Map, LogOut, User, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/rankings', icon: BarChart3, label: 'Rankings' },
    { path: '/map', icon: Map, label: 'Map View' },
    { path: '/compare', icon: GitCompare, label: 'Compare' },
    { path: '/methodology', icon: Info, label: 'Methodology' },
  ];

  return (
    <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-3 group">
              <div className="hidden sm:block">
                <h1 className="text-xl font-black text-zinc-900 leading-tight tracking-tighter">UrbEco</h1>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sustainability Index</p>
              </div>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
                    isActive
                      ? 'bg-green-50 text-green-700'
                      : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/assess">
                   <Button size="sm" className="hidden sm:flex bg-green-600 hover:bg-green-700 rounded-xl font-bold gap-2">
                    <PlusCircle className="w-4 h-4" />
                    Assess City
                  </Button>
                </Link>
                <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center border-2 border-zinc-200 overflow-hidden">
                   {user.photoURL ? (
                     <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                   ) : (
                     <User className="w-5 h-5 text-zinc-400" />
                   )}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" className="font-bold rounded-xl" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 rounded-xl font-bold shadow-lg shadow-green-100" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
