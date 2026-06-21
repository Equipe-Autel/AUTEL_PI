import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario, Pet, Reserva, Plano } from '../types';
import { getItem, setItem, removeItem, STORAGE_KEYS, generateId, USUARIOS_PADRAO } from '../utils/storage';
import { apiLogin, apiRegister, apiFetchProfile, apiDeleteUser, apiUpdateUser, apiListAllUsers } from '../services/auth';
import { apiCreatePet, apiListMyPets, apiUpdatePet, apiDeletePet } from '../services/pets';
import { apiListPlans, apiCreateReservation, apiListMyReservations, apiListAllReservations, apiCancelReservation, apiUpdateReservation, mapReservaFromBackend, apiCreatePlan, apiUpdatePlan, apiDeletePlan } from '../services/reservations';

const VAGAS_PADRAO = 20;

interface AppContextData {
  usuarios: Usuario[];
  pets: Pet[];
  reservas: Reserva[];
  planos: Plano[];
  vagasTotais: number;
  usuarioLogado: Usuario | null;
  loading: boolean;
  adicionarUsuario: (usuario: Omit<Usuario, 'id'>) => Promise<Usuario>;
  atualizarUsuario: (id: string, dados: Partial<Usuario>) => Promise<void>;
  removerUsuario: (id: string) => Promise<void>;
  adicionarPet: (pet: Omit<Pet, 'id'>) => Promise<Pet>;
  atualizarPet: (id: string, dados: Partial<Pet>) => Promise<void>;
  removerPet: (id: string) => Promise<void>;
  adicionarReserva: (reserva: Omit<Reserva, 'id' | 'dataCadastro'>) => Promise<Reserva>;
  atualizarReserva: (id: string, dados: Partial<Reserva>) => Promise<void>;
  removerReserva: (id: string) => void;
  cancelarReserva: (id: string) => Promise<{ sucesso: boolean; multa: number }>;
  calcularValorHospedagem: (dataEntrada: string, dataSaida: string, tipoAcomodacao: string) => number;
  obterVagasDisponiveis: (dataEntrada: string, dataSaida: string) => number;
  adicionarPlano: (plano: Omit<Plano, 'id'>) => Promise<void>;
  atualizarPlano: (id: string, dados: Partial<Omit<Plano, 'id'>>) => Promise<void>;
  removerPlano: (id: string) => Promise<void>;
  atualizarVagasTotais: (vagas: number) => void;
  login: (email: string, senha: string) => Promise<Usuario | null>;
  logout: () => void;
  resetDados: () => Promise<void>;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export const useApp = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [vagasTotais, setVagasTotais] = useState<number>(VAGAS_PADRAO);
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Carrega dados do AsyncStorage na inicialização
  useEffect(() => {
    const loadData = async () => {
      const [storedUsuarios, storedPets, storedReservas, storedUsuarioLogado, storedVagas, token] = await Promise.all([
        getItem<Usuario[]>(STORAGE_KEYS.USUARIOS),
        getItem<Pet[]>(STORAGE_KEYS.PETS),
        getItem<Reserva[]>(STORAGE_KEYS.RESERVAS),
        getItem<Usuario>(STORAGE_KEYS.USUARIO_LOGADO),
        getItem<number>(STORAGE_KEYS.VAGAS_TOTAIS),
        getItem<string>('auth_token'),
      ]);

      setUsuarios(storedUsuarios ?? USUARIOS_PADRAO);
      setPets(storedPets ?? []);
      setReservas(storedReservas ?? []);
      
      try {
        const backendPlans = await apiListPlans();
        setPlanos(backendPlans);
      } catch (err) {
        console.log('[AppContext] Erro ao buscar planos do backend:', err);
        setPlanos([]);
      }
      setVagasTotais(storedVagas ?? VAGAS_PADRAO);
      
      if (token && storedUsuarioLogado) {
        try {
          const profile = await apiFetchProfile(storedUsuarioLogado.id, token, storedUsuarioLogado.isAdmin);
          setUsuarioLogado(profile);
        } catch (err) {
          console.log('[AppContext] Falha ao recuperar sessão ativa:', err);
          await removeItem('auth_token');
          setUsuarioLogado(null);
        }
      } else {
        setUsuarioLogado(storedUsuarioLogado ?? null);
      }
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

  // Persiste vagas
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

  // Carrega pets do backend quando o usuário loga
  useEffect(() => {
    const fetchPets = async () => {
      const token = await getItem<string>('auth_token');
      if (token && usuarioLogado) {
        try {
          const userPets = await apiListMyPets(token);
          setPets(userPets);
        } catch (err) {
          console.log('[AppContext] Erro ao carregar pets do backend:', err);
        }
      } else {
        setPets([]);
      }
    };
    
    fetchPets();
  }, [usuarioLogado]);

  // Carrega todos os usuários do backend se o administrador estiver logado
  useEffect(() => {
    const fetchUsers = async () => {
      const token = await getItem<string>('auth_token');
      if (token && usuarioLogado && usuarioLogado.isAdmin) {
        try {
          const allUsers = await apiListAllUsers(token);
          setUsuarios(allUsers);
        } catch (err) {
          console.log('[AppContext] Erro ao carregar usuários do backend:', err);
        }
      }
    };

    fetchUsers();
  }, [usuarioLogado]);

  useEffect(() => {
    const fetchReservations = async () => {
      const token = await getItem<string>('auth_token');
      if (token && usuarioLogado) {
        try {
          const raw = usuarioLogado.isAdmin
            ? await apiListAllReservations(token)
            : await apiListMyReservations(token);
          const mapped = raw.map(r => mapReservaFromBackend(r, planos));
          setReservas(mapped);
        } catch (err) {
          console.log('[AppContext] Erro ao carregar reservas:', err);
        }
      } else {
        setReservas([]);
      }
    };
    fetchReservations();
  }, [usuarioLogado, planos]);

  const adicionarUsuario = async (usuario: Omit<Usuario, 'id'>): Promise<Usuario> => {
    const novo = await apiRegister(usuario);
    setUsuarios(prev => [...prev.filter(u => u.email !== novo.email), novo]);
    return novo;
  };

  const atualizarUsuario = async (id: string, dados: Partial<Usuario>): Promise<void> => {
    const token = await getItem<string>('auth_token');
    if (!token) throw new Error('Token de autenticação não encontrado.');
    const updated = await apiUpdateUser(id, dados, token);
    setUsuarios(prev => prev.map(u => (u.id === id ? updated : u)));
    if (usuarioLogado?.id === id) {
      setUsuarioLogado(updated);
    }
  };

  const removerUsuario = async (id: string): Promise<void> => {
    const token = await getItem<string>('auth_token');
    if (!token) throw new Error('Token de autenticação não encontrado.');
    await apiDeleteUser(id, token);
    setUsuarios(prev => prev.filter(u => u.id !== id));
    setPets(prev => prev.filter(p => p.usuarioId !== id));
    setReservas(prev => prev.filter(r => r.usuarioId !== id));
  };

  const adicionarPet = async (pet: Omit<Pet, 'id'>): Promise<Pet> => {
    const token = await getItem<string>('auth_token');
    if (!token) throw new Error('Token de autenticação não encontrado.');
    const novo = await apiCreatePet(pet, token);
    setPets(prev => [...prev.filter(p => p.id !== novo.id), novo]);
    return novo;
  };

  const atualizarPet = async (id: string, dados: Partial<Pet>): Promise<void> => {
    const token = await getItem<string>('auth_token');
    if (!token) throw new Error('Token de autenticação não encontrado.');
    const updated = await apiUpdatePet(id, dados, token);
    setPets(prev => prev.map(p => (p.id === id ? updated : p)));
  };

  const removerPet = async (id: string): Promise<void> => {
    const token = await getItem<string>('auth_token');
    if (!token) throw new Error('Token de autenticação não encontrado.');
    await apiDeletePet(id, token);
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

  const adicionarPlano = async (plano: Omit<Plano, 'id'>): Promise<void> => {
    const token = await getItem<string>('auth_token');
    if (!token) throw new Error('Token de autenticação não encontrado.');
    const novo = await apiCreatePlan(plano, token);
    setPlanos(prev => [...prev, novo]);
  };

  const atualizarPlano = async (id: string, dados: Partial<Omit<Plano, 'id'>>): Promise<void> => {
    const token = await getItem<string>('auth_token');
    if (!token) throw new Error('Token de autenticação não encontrado.');
    const updated = await apiUpdatePlan(id, dados, token);
    setPlanos(prev => prev.map(p => (p.id === id ? updated : p)));
  };

  const removerPlano = async (id: string): Promise<void> => {
    const token = await getItem<string>('auth_token');
    if (!token) throw new Error('Token de autenticação não encontrado.');
    await apiDeletePlan(id, token);
    setPlanos(prev => prev.filter(p => p.id !== id));
  };

  const atualizarVagasTotais = (vagas: number) => {
    setVagasTotais(vagas);
  };

  const adicionarReserva = async (reserva: Omit<Reserva, 'id' | 'dataCadastro'>): Promise<Reserva> => {
    const token = await getItem<string>('auth_token');
    if (!token) throw new Error('Token de autenticação não encontrado.');
    const plano = planos.find(p => p.nome === reserva.tipoAcomodacao);
    if (!plano) throw new Error('Plano de hospedagem correspondente não encontrado.');
    const created = await apiCreateReservation(reserva, Number(plano.id), token);
    const mapped = mapReservaFromBackend(created, planos);
    setReservas(prev => [...prev.filter(r => r.id !== mapped.id), mapped]);
    return mapped;
  };

  const atualizarReserva = async (id: string, dados: Partial<Reserva>): Promise<void> => {
    const token = await getItem<string>('auth_token');
    if (!token) throw new Error('Token de autenticação não encontrado.');

    let planoId: number | undefined;
    if (dados.tipoAcomodacao) {
      const plano = planos.find(p => p.nome === dados.tipoAcomodacao);
      if (plano) {
        planoId = Number(plano.id);
      }
    }

    const updated = await apiUpdateReservation(id, dados, planoId, token);
    const mapped = mapReservaFromBackend(updated, planos);
    setReservas(prev => prev.map(r => (r.id === id ? mapped : r)));
  };

  const removerReserva = (id: string) => {
    setReservas(prev => prev.filter(r => r.id !== id));
  };

  const cancelarReserva = async (id: string): Promise<{ sucesso: boolean; multa: number }> => {
    const token = await getItem<string>('auth_token');
    if (!token) throw new Error('Token de autenticação não encontrado.');
    const res = await apiCancelReservation(id, token);

    setReservas(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'Cancelada' as const } : r))
    );

    return { sucesso: true, multa: res.multa ? Number(res.multa) : 0 };
  };

  const login = async (email: string, senha: string): Promise<Usuario | null> => {
    const { token, usuario } = await apiLogin(email, senha);
    await setItem('auth_token', token);

    let fullProfile = usuario;
    if (!usuario.isAdmin) {
      fullProfile = await apiFetchProfile(usuario.id, token, false);
    }

    setUsuarioLogado(fullProfile);
    return fullProfile;
  };

  const logout = () => {
    setUsuarioLogado(null);
    removeItem('auth_token');
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
