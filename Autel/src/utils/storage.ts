import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario, Pet, Reserva } from '../types';

export const STORAGE_KEYS = {
  USUARIOS: 'autel_usuarios',
  PETS: 'autel_pets',
  RESERVAS: 'autel_reservas',
  USUARIO_LOGADO: 'autel_usuario_logado',
  PLANOS: 'autel_planos',
  VAGAS_TOTAIS: 'autel_vagas_totais',
};

export const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

export const setItem = async <T>(key: string, value: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
};

export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // ignore
  }
};

export const clearAll = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch {
    // ignore
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const USUARIOS_PADRAO: Usuario[] = [
  {
    id: 'admin-1',
    nome: 'Administrador',
    sobrenome: 'Autel',
    cpf: '000.000.000-00',
    telefone: '(11) 99999-9999',
    email: 'admin@autel.com',
    logradouro: 'Rua Principal',
    numero: '123',
    complemento: '',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    contatoEmergencia: '',
    telefoneEmergencia: '',
    isAdmin: true,
  },
  {
    id: 'user-1',
    nome: 'João',
    sobrenome: 'Silva',
    cpf: '123.456.789-00',
    telefone: '(11) 98765-4321',
    email: 'joao@email.com',
    logradouro: 'Rua das Flores',
    numero: '456',
    complemento: 'Apto 12',
    bairro: 'Jardim Paulista',
    cidade: 'São Paulo',
    estado: 'SP',
    contatoEmergencia: 'Maria Silva',
    telefoneEmergencia: '(11) 97654-3210',
    isAdmin: false,
  },
];
