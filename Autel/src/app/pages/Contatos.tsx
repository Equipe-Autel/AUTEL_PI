import React, { useState } from 'react';
import { Phone, Mail, Clock, Send, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export const Contatos: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de envio
    toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    setFormData({ nome: '', email: '', telefone: '', mensagem: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="pb-4">
      {/* Hero Section - Compacto */}
      <section className="text-white py-8 px-4" style={{ background: 'linear-gradient(135deg, var(--autel-teal) 0%, var(--autel-teal-dark) 100%)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-3">
            Entre em Contato
          </h1>
          <p className="text-base opacity-90">
            Estamos aqui para responder suas dúvidas
          </p>
        </div>
      </section>

      <div className="px-4 py-6 space-y-6">
        {/* Contact Information - Cards compactos */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-900">Informações de Contato</h2>
          <div className="space-y-3">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(45, 122, 123, 0.1)' }}>
                    <Phone className="w-6 h-6" style={{ color: 'var(--autel-teal)' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Telefone</h3>
                    <p className="text-sm text-gray-600">(11) 3456-7890</p>
                    <p className="text-sm text-gray-600">(11) 98765-4321 (WhatsApp)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(230, 126, 77, 0.1)' }}>
                    <Mail className="w-6 h-6" style={{ color: 'var(--autel-orange)' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">E-mail</h3>
                    <p className="text-sm text-gray-600">contato@autel.com.br</p>
                    <p className="text-sm text-gray-600">reservas@autel.com.br</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(45, 122, 123, 0.1)' }}>
                    <MapPin className="w-6 h-6" style={{ color: 'var(--autel-teal)' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Localização</h3>
                    <p className="text-sm text-gray-600">São Paulo - SP</p>
                    <p className="text-sm text-gray-600">Centro de Hospedagem</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(45, 122, 123, 0.1)' }}>
                    <Clock className="w-6 h-6" style={{ color: 'var(--autel-teal)' }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Horário de Funcionamento</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Seg-Sex:</span> 7h às 20h</p>
                      <p><span className="font-medium">Sábados:</span> 8h às 18h</p>
                      <p><span className="font-medium">Domingos:</span> 9h às 17h</p>
                      <p className="text-xs mt-2" style={{ color: 'var(--autel-orange)' }}>
                        * Plantão 24h para emergências
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Form - Compacto */}
        <div>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Envie uma Mensagem</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nome" className="text-sm">Nome Completo *</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    placeholder="Seu nome"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm">E-mail *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="seu@email.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="telefone" className="text-sm">Telefone *</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    placeholder="(11) 99999-9999"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="mensagem" className="text-sm">Mensagem *</Label>
                  <Textarea
                    id="mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    required
                    placeholder="Como podemos ajudar?"
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <Button type="submit" className="w-full" style={{ backgroundColor: 'var(--autel-teal)', color: 'white' }}>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Mensagem
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};