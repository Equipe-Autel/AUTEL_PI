import React from 'react';
import { Link } from 'react-router';
import { PawPrint, Heart, Shield, Clock, Star, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export const Home: React.FC = () => {
  return (
    <div className="pb-4">
      {/* Hero Section - Compacto estilo app */}
      <section className="text-white py-8 px-4" style={{ background: 'linear-gradient(135deg, var(--autel-teal) 0%, var(--autel-teal-dark) 100%)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-3">
            Bem-vindo ao Autel
          </h1>
          <p className="text-base mb-6 opacity-90">
            O melhor centro de hospedagem para seu melhor amigo
          </p>
          <Link to="/hotel">
            <Button size="lg" className="w-full max-w-xs" style={{ backgroundColor: 'var(--autel-orange)', color: 'white' }}>
              Fazer Reserva
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section - Cards compactos */}
      <section className="py-6 px-4">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          Por Que Escolher o Autel?
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: 'rgba(45, 122, 123, 0.1)' }}>
                <Heart className="w-6 h-6" style={{ color: 'var(--autel-teal)' }} />
              </div>
              <h3 className="text-sm font-semibold mb-1">Amor</h3>
              <p className="text-xs text-gray-600">
                Atenção individual
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: 'rgba(230, 126, 77, 0.1)' }}>
                <Shield className="w-6 h-6" style={{ color: 'var(--autel-orange)' }} />
              </div>
              <h3 className="text-sm font-semibold mb-1">Segurança</h3>
              <p className="text-xs text-gray-600">
                Monitoramento 24h
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: 'rgba(45, 122, 123, 0.1)' }}>
                <Clock className="w-6 h-6" style={{ color: 'var(--autel-teal)' }} />
              </div>
              <h3 className="text-sm font-semibold mb-1">Flexível</h3>
              <p className="text-xs text-gray-600">
                Reservas online
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: 'rgba(230, 126, 77, 0.1)' }}>
                <Star className="w-6 h-6" style={{ color: 'var(--autel-orange)' }} />
              </div>
              <h3 className="text-sm font-semibold mb-1">Excelência</h3>
              <p className="text-xs text-gray-600">
                Primeira linha
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Services Section - Lista compacta */}
      <section className="py-6 px-4 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Nossos Planos
          </h2>
        </div>
        <div className="space-y-3">
          <Card className="border-l-4 shadow-sm" style={{ borderLeftColor: 'var(--autel-teal)' }}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg" style={{ color: 'var(--autel-teal)' }}>Standard</h3>
                  <p className="text-2xl font-bold text-gray-900">R$ 80<span className="text-sm text-gray-600">/dia</span></p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <ul className="space-y-1 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--autel-teal)' }}></div>
                  3 passeios diários
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--autel-teal)' }}></div>
                  Alimentação balanceada
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 shadow-sm" style={{ borderLeftColor: 'var(--autel-orange)' }}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg" style={{ color: 'var(--autel-orange)' }}>Premium</h3>
                  <p className="text-2xl font-bold text-gray-900">R$ 150<span className="text-sm text-gray-600">/dia</span></p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <ul className="space-y-1 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--autel-orange)' }}></div>
                  Suíte individual + 5 passeios
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--autel-orange)' }}></div>
                  Fotos diárias do pet
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 shadow-sm" style={{ borderLeftColor: 'var(--autel-teal-dark)' }}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg" style={{ color: 'var(--autel-teal-dark)' }}>Luxo</h3>
                  <p className="text-2xl font-bold text-gray-900">R$ 250<span className="text-sm text-gray-600">/dia</span></p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <ul className="space-y-1 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--autel-teal-dark)' }}></div>
                  Suíte VIP + Spa inclusos
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--autel-teal-dark)' }}></div>
                  Vídeos ao vivo 24h
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mission Section - Simplificado */}
      <section className="py-6 px-4">
        <Card style={{ backgroundColor: 'var(--autel-beige)', borderColor: 'var(--autel-teal)' }} className="border-2">
          <CardContent className="p-4">
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--autel-teal-dark)' }}>
              Nossa Missão
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              Oferecer um ambiente seguro, confortável e divertido para que 
              seu bichinho se sinta em casa enquanto você estiver ausente.
            </p>
            <Link to="/quem-somos">
              <Button variant="outline" size="sm" className="w-full" style={{ borderColor: 'var(--autel-teal)', color: 'var(--autel-teal)' }}>
                Conhecer a Equipe
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};