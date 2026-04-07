import React from 'react';
import { Link, useLocation } from 'react-router';
import { PawPrint, Home, Building2, Users, Mail, LogOut, User, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { usuarioLogado, logout } = useApp();

  const navLinks = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/hotel', label: 'Hotel', icon: Building2 },
    { path: '/quem-somos', label: 'Equipe', icon: Users },
    { path: '/contatos', label: 'Contato', icon: Mail },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Verificar se está em páginas especiais que não devem mostrar bottom nav
  const hideBottomNav = ['/login', '/cadastro-usuario', '/admin', '/cadastro-pet'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--autel-beige)' }}>
      {/* Header - Mais compacto estilo app */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 font-bold" style={{ color: 'var(--autel-teal)' }}>
              <PawPrint className="w-6 h-6" />
              <span className="text-lg">Autel</span>
            </Link>

            {/* User Menu - Compacto */}
            <div className="flex items-center gap-2">
              {usuarioLogado ? (
                <>
                  {usuarioLogado.isAdmin && (
                    <Link to="/admin">
                      <Button variant="ghost" size="sm" className="text-xs">
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Link to="/minhas-reservas">
                    <Button variant="ghost" size="sm">
                      <Calendar className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button size="sm" style={{ backgroundColor: 'var(--autel-teal)', color: 'white' }}>
                      Entrar
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Bottom Navigation - Estilo App Mobile */}
      {!hideBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
          <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
            {navLinks.map(link => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex flex-col items-center justify-center flex-1 py-2 transition-colors"
                >
                  <Icon 
                    className="w-6 h-6 mb-1" 
                    style={{ color: active ? 'var(--autel-teal)' : '#6B7280' }}
                  />
                  <span 
                    className="text-xs"
                    style={{ 
                      color: active ? 'var(--autel-teal)' : '#6B7280',
                      fontWeight: active ? '600' : '400'
                    }}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};