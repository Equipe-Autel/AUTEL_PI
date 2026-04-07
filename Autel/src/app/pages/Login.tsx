import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { LogIn, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const usuario = login(email);
    
    if (usuario) {
      toast.success(`Bem-vindo, ${usuario.nome}!`);
      navigate('/');
    } else {
      toast.error('Usuário não encontrado. Verifique o e-mail ou cadastre-se.');
    }
  };

  const handleResetData = () => {
    // Limpa os dados do localStorage para resetar para os valores padrão
    localStorage.removeItem('autel_usuarios');
    localStorage.removeItem('autel_pets');
    localStorage.removeItem('autel_reservas');
    localStorage.removeItem('autel_usuario_logado');
    toast.success('Dados resetados! Recarregue a página.');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(45, 122, 123, 0.1)' }}>
              <LogIn className="w-8 h-8" style={{ color: 'var(--autel-teal)' }} />
            </div>
            <CardTitle className="text-2xl">Entrar no Autel</CardTitle>
            <CardDescription>
              Digite seu e-mail cadastrado para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Entrar
              </Button>

              <div className="text-center text-sm text-gray-600">
                Ainda não tem conta?{' '}
                <Link to="/cadastro-usuario" className="hover:underline font-semibold" style={{ color: 'var(--autel-teal)' }}>
                  Cadastre-se aqui
                </Link>
              </div>

              <div className="border-t pt-4 mt-4">
                <p className="text-xs text-gray-500 text-center mb-3 font-semibold">Usuários de teste:</p>
                <div className="space-y-2">
                  <div className="p-2 rounded text-center" style={{ backgroundColor: 'var(--autel-beige)' }}>
                    <p className="text-xs font-semibold" style={{ color: 'var(--autel-orange)' }}>Administrador</p>
                    <p className="text-xs text-gray-600">admin@autel.com</p>
                  </div>
                  <div className="p-2 rounded text-center" style={{ backgroundColor: 'var(--autel-beige)' }}>
                    <p className="text-xs font-semibold" style={{ color: 'var(--autel-teal)' }}>Usuário Comum</p>
                    <p className="text-xs text-gray-600">joao@email.com</p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-4">
                <button 
                  type="button" 
                  onClick={handleResetData}
                  className="text-xs text-red-600 hover:text-red-700 hover:underline"
                >
                  ⚠️ Resetar dados do sistema
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};