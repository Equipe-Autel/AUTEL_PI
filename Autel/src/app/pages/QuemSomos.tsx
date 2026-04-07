import React from 'react';
import { Heart, Award, Users } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

export const QuemSomos: React.FC = () => {
  const cuidadores = [
    {
      nome: 'Amanda Dahm',
      cargo: 'Veterinária e Fundadora',
      especialidade: 'Medicina Veterinária'
    },
    {
      nome: 'Caroline Lopes',
      cargo: 'Especialista em Comportamento',
      especialidade: 'Adestramento'
    },
    {
      nome: 'Ian Melo',
      cargo: 'Cuidador Senior',
      especialidade: 'Cuidados e Nutrição'
    },
    {
      nome: 'Antônio Lucas',
      cargo: 'Coordenador de Atividades',
      especialidade: 'Recreação'
    }
  ];

  return (
    <div className="pb-4">
      {/* Hero Section - Compacto */}
      <section className="text-white py-8 px-4" style={{ background: 'linear-gradient(135deg, var(--autel-teal) 0%, var(--autel-teal-dark) 100%)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-3">
            Nossa Equipe
          </h1>
          <p className="text-base opacity-90">
            Profissionais dedicados e apaixonados por animais
          </p>
        </div>
      </section>

      {/* Story Section - Compacto */}
      <section className="py-6 px-4 bg-white">
        <h2 className="text-xl font-bold mb-3 text-gray-900">Nossa História</h2>
        <div className="text-sm text-gray-700 space-y-3">
          <p>
            O Autel nasceu em 2015 do sonho de oferecer um espaço onde pets pudessem ser tratados 
            não apenas com profissionalismo, mas principalmente com amor e dedicação. Fundado pela 
            Dra. Ana Silva, veterinária com mais de 15 anos de experiência, nosso hotel começou como 
            um pequeno espaço com capacidade para apenas 5 pets.
          </p>
          <p>
            Hoje, somos uma equipe multidisciplinar de profissionais qualificados, cada um trazendo 
            sua expertise única para garantir que cada pet receba o melhor cuidado possível.
          </p>
        </div>
      </section>

      {/* Values Section - Cards compactos */}
      <section className="py-6 px-4">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Nossos Valores</h2>
        <div className="space-y-3">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Amor pelos Animais</h3>
                  <p className="text-sm text-gray-600">
                    Cada membro da nossa equipe é apaixonado por animais. Para nós, é uma vocação.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Excelência</h3>
                  <p className="text-sm text-gray-600">
                    Buscamos constantemente a melhoria, investindo em treinamentos e infraestrutura.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Transparência</h3>
                  <p className="text-sm text-gray-600">
                    Mantemos comunicação aberta, fornecendo atualizações regulares aos tutores.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team Section - Cards compactos */}
      <section className="py-6 px-4 bg-white">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Equipe de Cuidadores</h2>
        <div className="space-y-3">
          {cuidadores.map((cuidador, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--autel-teal) 0%, var(--autel-teal-dark) 100%)' }}>
                    <span className="text-lg font-bold text-white">
                      {cuidador.nome.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{cuidador.nome}</h3>
                    <p className="text-sm mb-1" style={{ color: 'var(--autel-teal)' }}>{cuidador.cargo}</p>
                    <div className="inline-block px-2 py-1 rounded-full text-xs" style={{ backgroundColor: 'rgba(45, 122, 123, 0.1)', color: 'var(--autel-teal-dark)' }}>
                      {cuidador.especialidade}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Certifications Section - Compacto */}
      <section className="py-6 px-4">
        <h2 className="text-xl font-bold mb-3 text-gray-900">Certificações</h2>
        <p className="text-sm text-gray-700 mb-4">
          Nossa equipe possui certificações reconhecidas, garantindo que seu pet receba cuidados 
          baseados nas melhores práticas do setor.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <Award className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--autel-teal)' }} />
              <p className="text-xs font-semibold">CRMV Certificado</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <Award className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--autel-teal)' }} />
              <p className="text-xs font-semibold">ISO 9001</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <Award className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--autel-teal)' }} />
              <p className="text-xs font-semibold">Pet Care Brasil</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <Award className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--autel-teal)' }} />
              <p className="text-xs font-semibold">5 Estrelas</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};