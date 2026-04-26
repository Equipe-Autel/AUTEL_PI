import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario, Pet, Reserva, Plano } from '../types';
import { getItem, setItem, removeItem, STORAGE_KEYS, generateId, USUARIOS_PADRAO } from '../utils/storage';

const PLANOS_PADRAO: Plano[] = [
  { id: 'standard', nome: 'Standard', descricao: 'Simples e Confortável', preco: 80 },
  { id: 'premium', nome: 'Premium', descricao: 'Espaço Ampliado', preco: 150 },
  { id: 'luxo', nome: 'Luxo', descricao: 'Experiência VIP', preco: 250 },
];
const VAGAS_PADRAO = 20;

interface AppContextData {
  usuarios: Usuario[];
  pets: Pet[];
  reservas: Reserva[];
  planos: Plano[];
  vagasTotais: number;
  usuarioLogado: Usuario | null;
  loading: boolean;
  adicionarUsuario: (usuario: Omit<Usuario, 'id'>) => Usuario;
  atualizarUsuario: (id: string, dados: Partial<Usuario>) => void;
  removerUsuario: (id: string) => void;
  adicionarPet: (pet: Omit<Pet, 'id'>) => Pet;
  atualizarPet: (id: string, dados: Partial<Pet>) => void;
  removerPet: (id: string) => void;
  adicionarReserva: (reserva: Omit<Reserva, 'id' | 'dataCadastro'>) => Reserva;
  atualizarReserva: (id: string, dados: Partial<Reserva>) => void;
  removerReserva: (id: string) => void;
  cancelarReserva: (id: string) => { sucesso: boolean; multa: number };
  calcularValorHospedagem: (dataEntrada: string, dataSaida: string, tipoAcomodacao: string) => number;
  obterVagasDisponiveis: (dataEntrada: string, dataSaida: string) => number;
  adicionarPlano: (plano: Omit<Plano, 'id'>) => void;
  atualizarPlano: (id: string, dados: Partial<Omit<Plano, 'id'>>) => void;
  removerPlano: (id: string) => void;
  atualizarVagasTotais: (vagas: number) => void;
  login: (email: string) => Usuario | null;
  logout: () => void;
  resetDados: () => Promise<void>;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export const useApp = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [planos, setPlanos] = useState<Plano[]>(PLANOS_PADRAO);
  const [vagasTotais, setVagasTotais] = useState<number>(VAGAS_PADRAO);
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Carrega dados do AsyncStorage na inicialização
  useEffect(() => {
    const loadData = async () => {
      const [storedUsuarios, storedPets, storedReservas, storedUsuarioLogado, storedPlanos, storedVagas] = await Promise.all([
        getItem<Usuario[]>(STORAGE_KEYS.USUARIOS),
        getItem<Pet[]>(STORAGE_KEYS.PETS),
        getItem<Reserva[]>(STORAGE_KEYS.RESERVAS),
        getItem<Usuario>(STORAGE_KEYS.USUARIO_LOGADO),
        getItem<Plano[]>(STORAGE_KEYS.PLANOS),
        getItem<number>(STORAGE_KEYS.VAGAS_TOTAIS),
      ]);

      setUsuarios(storedUsuarios ?? USUARIOS_PADRAO);
      setPets(storedPets ?? []);
      setReservas(storedReservas ?? []);
      setPlanos(storedPlanos ?? PLANOS_PADRAO);
      setVagasTotais(storedVagas ?? VAGAS_PADRAO);
      setUsuarioLogado(storedUsuarioLogado ?? null);
      setLoading(false);
    };

    loadData();
  }, []);

  // Persiste usuários
  useEffect(() => {
    if (!loading) setItem(STORAGE_KEYS.USUARIOS, usuarios);
  }, [usuarios, loading]);

  // Persiste pets
  useEffect(() => {
    if (!loading) setItem(STORAGE_KEYS.PETS, pets);
  }, [pets, loading]);

  // Persiste reservas
  useEffect(() => {
    if (!loading) setItem(STORAGE_KEYS.RESERVAS, reservas);
  }, [reservas, loading]);

  // Persiste planos e vagas
  useEffect(() => {
    if (!loading) setItem(STORAGE_KEYS.PLANOS, planos);
  }, [planos, loading]);

  useEffect(() => {
    if (!loading) setItem(STORAGE_KEYS.VAGAS_TOTAIS, vagasTotais);
  }, [vagasTotais, loading]);

  // Persiste usuário logado
  useEffect(() => {
    if (!loading) {
      if (usuarioLogado) {
        setItem(STORAGE_KEYS.USUARIO_LOGADO, usuarioLogado);
      } else {
        removeItem(STORAGE_KEYS.USUARIO_LOGADO);
      }
    }
  }, [usuarioLogado, loading]);

  const adicionarUsuario = (usuario: Omit<Usuario, 'id'>): Usuario => {
    const novo: Usuario = { ...usuario, id: `user-${generateId()}` };
    setUsuarios(prev => [...prev, novo]);
    return novo;
  };

  const atualizarUsuario = (id: string, dados: Partial<Usuario>) => {
    setUsuarios(prev => prev.map(u => (u.id === id ? { ...u, ...dados } : u)));
    if (usuarioLogado?.id === id) {
      setUsuarioLogado(prev => (prev ? { ...prev, ...dados } : null));
    }
  };

  const removerUsuario = (id: string) => {
    setUsuarios(prev => prev.filter(u => u.id !== id));
    setPets(prev => prev.filter(p => p.usuarioId !== id));
    setReservas(prev => prev.filter(r => r.usuarioId !== id));
  };

  const adicionarPet = (pet: Omit<Pet, 'id'>): Pet => {
    const novo: Pet = { ...pet, id: `pet-${generateId()}` };
    setPets(prev => [...prev, novo]);
    return novo;
  };

  const atualizarPet = (id: string, dados: Partial<Pet>) => {
    setPets(prev => prev.map(p => (p.id === id ? { ...p, ...dados } : p)));
  };

  const removerPet = (id: string) => {
    setPets(prev => prev.filter(p => p.id !== id));
    setReservas(prev => prev.filter(r => r.petId !== id));
  };

  const calcularValorHospedagem = (
    dataEntrada: string,
    dataSaida: string,
    tipoAcomodacao: string
  ): number => {
    const entrada = new Date(dataEntrada);
    const saida = new Date(dataSaida);
    const dias = Math.ceil((saida.getTime() - entrada.getTime()) / (1000 * 60 * 60 * 24));
    const plano = planos.find(p => p.nome === tipoAcomodacao);
    return Math.max(0, dias * (plano?.preco ?? 80));
  };

  const obterVagasDisponiveis = (dataEntrada: string, dataSaida: string): number => {
    const entrada = new Date(dataEntrada);
    const saida = new Date(dataSaida);
    const conflitantes = reservas.filter(r => {
      if (r.status !== 'Ativa') return false;
      const rEntrada = new Date(r.dataEntrada);
      const rSaida = new Date(r.dataSaidaPrevista);
      return entrada <= rSaida && saida >= rEntrada;
    });
    return vagasTotais - conflitantes.length;
  };

  const adicionarPlano = (plano: Omit<Plano, 'id'>) => {
    const novo: Plano = { ...plano, id: `plano-${generateId()}` };
    setPlanos(prev => [...prev, novo]);
  };

  const atualizarPlano = (id: string, dados: Partial<Omit<Plano, 'id'>>) => {
    setPlanos(prev => prev.map(p => (p.id === id ? { ...p, ...dados } : p)));
  };

  const removerPlano = (id: string) => {
    setPlanos(prev => prev.filter(p => p.id !== id));
  };

  const atualizarVagasTotais = (vagas: number) => {
    setVagasTotais(vagas);
  };

  const adicionarReserva = (reserva: Omit<Reserva, 'id' | 'dataCadastro'>): Reserva => {
    const nova: Reserva = {
      ...reserva,
      id: `reserva-${generateId()}`,
      dataCadastro: new Date().toISOString(),
    };
    setReservas(prev => [...prev, nova]);
    return nova;
  };

  const atualizarReserva = (id: string, dados: Partial<Reserva>) => {
    setReservas(prev => prev.map(r => (r.id === id ? { ...r, ...dados } : r)));
  };

  const removerReserva = (id: string) => {
    setReservas(prev => prev.filter(r => r.id !== id));
  };

  const cancelarReserva = (id: string): { sucesso: boolean; multa: number } => {
    const reserva = reservas.find(r => r.id === id);
    if (!reserva) return { sucesso: false, multa: 0 };

    const hoje = new Date();
    const dataEntrada = new Date(reserva.dataEntrada);
    const diasAteEntrada = Math.ceil(
      (dataEntrada.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
    );

    const multa = diasAteEntrada < 7 && diasAteEntrada >= 0 ? reserva.valorTotal * 0.3 : 0;

    setReservas(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'Cancelada' as const } : r))
    );

    return { sucesso: true, multa };
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

  const resetDados = async () => {
    setUsuarios(USUARIOS_PADRAO);
    setPets([]);
    setReservas([]);
    setUsuarioLogado(null);
  };

  return (
    <AppContext.Provider
      value={{
        usuarios,
        pets,
        reservas,
        planos,
        vagasTotais,
        usuarioLogado,
        loading,
        adicionarUsuario,
        atualizarUsuario,
        removerUsuario,
        adicionarPet,
        atualizarPet,
        removerPet,
        adicionarReserva,
        atualizarReserva,
        removerReserva,
        cancelarReserva,
        calcularValorHospedagem,
        obterVagasDisponiveis,
        adicionarPlano,
        atualizarPlano,
        removerPlano,
        atualizarVagasTotais,
        login,
        logout,
        resetDados,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
