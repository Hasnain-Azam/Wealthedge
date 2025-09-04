import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <nav className="max-w-6xl mx-auto h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 rounded-full bg-gradient-to-br from-wealth-gold to-wealth-green/80 shadow-sm" />
          <span className="text-lg font-semibold tracking-tight">WealthEdge</span>
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-wealth-slate">{user.email}</span>
            <button
              onClick={logout}
              className="inline-flex items-center px-3 py-2 rounded-lg bg-black text-white hover:opacity-90 transition shadow-sm"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
