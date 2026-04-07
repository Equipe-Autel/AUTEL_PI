import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Usuario {
  id: string;
  nome: string;
  cpf: string;
  rg: string;
  telefone: string;
  email: string;
  endereco: string;
  isAdmin?: boolean;
}

export interface Pet {
  id: string;
  usuarioId: string;
  nome: string;
  especie: 'Cachorro' | 'Gato';
  raca: string;
  idade: number;
  peso: number;
  observacoesSaude: string;
  porte: 'Pequeno' | 'Médio' | 'Grande';
  comportamento: 'Calmo' | 'Agitado' | 'Agressivo';
  brincadeirasFavoritas: string;
  sexo: 'Macho' | 'Fêmea';
  naturalidade: string;
  castrado: boolean;
}

export interface Reserva {
  id: string;
  petId: string;
  usuarioId: string;
  dataEntrada: string;
  dataSaidaPrevista: string;
  dataSaida?: string;
  responsavelAlimentacao: 'Tutor' | 'Hotel';
  tipoAcomodacao: 'Standard' | 'Premium' | 'Luxo';
  observacoesComida: string;
  status: 'Ativa' | 'Cancelada' | 'Finalizada';
  valorTotal: number;
  dataCadastro: string;
}

interface AppContextData {
  usuarios: Usuario[];
  pets: Pet[];
  reservas: Reserva[];
  usuarioLogado: Usuario | null;
  adicionarUsuario: (usuario: Omit<Usuario, 'id'>) => Usuario;
  atualizarUsuario: (id: string, usuario: Partial<Usuario>) => void;
  adicionarPet: (pet: Omit<Pet, 'id'>) => Pet;
  atualizarPet: (id: string, pet: Partial<Pet>) => void;
  adicionarReserva: (reserva: Omit<Reserva, 'id' | 'dataCadastro'>) => Reserva;
  atualizarReserva: (id: string, reserva: Partial<Reserva>) => void;
  cancelarReserva: (id: string) => { sucesso: boolean; multa: number };
  calcularValorHospedagem: (dataEntrada: string, dataSaida: string, tipoAcomodacao: string) => number;
  obterVagasDisponiveis: (dataEntrada: string, dataSaida: string) => number;
  login: (email: string) => Usuario | null;
  logout: () => void;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export const useApp = () => useContext(AppContext);

const VAGAS_TOTAIS = 20;
const VALORES_DIARIA = {
  'Standard': 80,
  'Premium': 150,
  'Luxo': 250
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => {
    const stored = localStorage.getItem('autel_usuarios');
    return stored ? JSON.parse(stored) : [
      {
        id: 'admin-1',
        nome: 'Administrador',
        cpf: '000.000.000-00',
        rg: '00.000.000-0',
        telefone: '(11) 99999-9999',
        email: 'admin@autel.com',
        endereco: 'Rua Principal, 123',
        isAdmin: true
      },
      {
        id: 'user-1',
        nome: 'João Silva',
        cpf: '123.456.789-00',
        rg: '12.345.678-9',
        telefone: '(11) 98765-4321',
        email: 'joao@email.com',
        endereco: 'Rua das Flores, 456 - São Paulo, SP',
        isAdmin: false
      }
    ];
  });

  const [pets, setPets] = useState<Pet[]>(() => {
    const stored = localStorage.getItem('autel_pets');
    return stored ? JSON.parse(stored) : [];
  });

  const [reservas, setReservas] = useState<Reserva[]>(() => {
    const stored = localStorage.getItem('autel_reservas');
    return stored ? JSON.parse(stored) : [];
  });

  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(() => {
    const stored = localStorage.getItem('autel_usuario_logado');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    localStorage.setItem('autel_usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    localStorage.setItem('autel_pets', JSON.stringify(pets));
  }, [pets]);

  useEffect(() => {
    localStorage.setItem('autel_reservas', JSON.stringify(reservas));
  }, [reservas]);

  useEffect(() => {
    if (usuarioLogado) {
      localStorage.setItem('autel_usuario_logado', JSON.stringify(usuarioLogado));
    } else {
      localStorage.removeItem('autel_usuario_logado');
    }
  }, [usuarioLogado]);

  const adicionarUsuario = (usuario: Omit<Usuario, 'id'>): Usuario => {
    const novoUsuario: Usuario = {
      ...usuario,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setUsuarios(prev => [...prev, novoUsuario]);
    return novoUsuario;
  };

  const atualizarUsuario = (id: string, dadosAtualizados: Partial<Usuario>) => {
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ...dadosAtualizados } : u));
    if (usuarioLogado?.id === id) {
      setUsuarioLogado(prev => prev ? { ...prev, ...dadosAtualizados } : null);
    }
  };

  const adicionarPet = (pet: Omit<Pet, 'id'>): Pet => {
    const novoPet: Pet = {
      ...pet,
      id: `pet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setPets(prev => [...prev, novoPet]);
    return novoPet;
  };

  const atualizarPet = (id: string, dadosAtualizados: Partial<Pet>) => {
    setPets(prev => prev.map(p => p.id === id ? { ...p, ...dadosAtualizados } : p));
  };

  const calcularValorHospedagem = (dataEntrada: string, dataSaida: string, tipoAcomodacao: string): number => {
    const entrada = new Date(dataEntrada);
    const saida = new Date(dataSaida);
    const dias = Math.ceil((saida.getTime() - entrada.getTime()) / (1000 * 60 * 60 * 24));
    const valorDiaria = VALORES_DIARIA[tipoAcomodacao as keyof typeof VALORES_DIARIA] || 80;
    return dias * valorDiaria;
  };

  const adicionarReserva = (reserva: Omit<Reserva, 'id' | 'dataCadastro'>): Reserva => {
    const novaReserva: Reserva = {
      ...reserva,
      id: `reserva-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      dataCadastro: new Date().toISOString()
    };
    setReservas(prev => [...prev, novaReserva]);
    return novaReserva;
  };

  const atualizarReserva = (id: string, dadosAtualizados: Partial<Reserva>) => {
    setReservas(prev => prev.map(r => r.id === id ? { ...r, ...dadosAtualizados } : r));
  };

  const cancelarReserva = (id: string): { sucesso: boolean; multa: number } => {
    const reserva = reservas.find(r => r.id === id);
    if (!reserva) return { sucesso: false, multa: 0 };

    const hoje = new Date();
    const dataEntrada = new Date(reserva.dataEntrada);
    const diasAteEntrada = Math.ceil((dataEntrada.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    
    let multa = 0;
    // Multa se cancelar com menos de 7 dias de antecedência
    if (diasAteEntrada < 7 && diasAteEntrada >= 0) {
      multa = reserva.valorTotal * 0.3; // 30% de multa
    }

    setReservas(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'Cancelada' as const } : r
    ));

    return { sucesso: true, multa };
  };

  const obterVagasDisponiveis = (dataEntrada: string, dataSaida: string): number => {
    const entrada = new Date(dataEntrada);
    const saida = new Date(dataSaida);

    const reservasConflitantes = reservas.filter(r => {
      if (r.status !== 'Ativa') return false;
      
      const rEntrada = new Date(r.dataEntrada);
      const rSaida = new Date(r.dataSaidaPrevista);
      
      return (entrada <= rSaida && saida >= rEntrada);
    });

    return VAGAS_TOTAIS - reservasConflitantes.length;
  };

  const login = (email: string): Usuario | null => {
    const usuario = usuarios.find(u => u.email === email);
    if (usuario) {
      setUsuarioLogado(usuario);
      return usuario;
    }
    return null;
  };

  const logout = () => {
    setUsuarioLogado(null);
  };

  return (
    <AppContext.Provider value={{
      usuarios,
      pets,
      reservas,
      usuarioLogado,
      adicionarUsuario,
      atualizarUsuario,
      adicionarPet,
      atualizarPet,
      adicionarReserva,
      atualizarReserva,
      cancelarReserva,
      calcularValorHospedagem,
      obterVagasDisponiveis,
      login,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};