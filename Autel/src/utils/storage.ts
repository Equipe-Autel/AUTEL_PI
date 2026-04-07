import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario, Pet, Reserva } from '../types';

export const STORAGE_KEYS = {
  USUARIOS: 'autel_usuarios',
  PETS: 'autel_pets',
  RESERVAS: 'autel_reservas',
  USUARIO_LOGADO: 'autel_usuario_logado',
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
    cpf: '000.000.000-00',
    rg: '00.000.000-0',
    telefone: '(11) 99999-9999',
    email: 'admin@autel.com',
    endereco: 'Rua Principal, 123',
    isAdmin: true,
  },
  {
    id: 'user-1',
    nome: 'João Silva',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    telefone: '(11) 98765-4321',
    email: 'joao@email.com',
    endereco: 'Rua das Flores, 456 - São Paulo, SP',
    isAdmin: false,
  },
];
