// Utilitários para localStorage
import { Usuario, Pet, Reserva } from '../types';

const STORAGE_KEYS = {
  USUARIOS: 'autel_usuarios',
  PETS: 'autel_pets',
  RESERVAS: 'autel_reservas',
  CURRENT_USER: 'autel_current_user',
};

// Usuários
export const getUsuarios = (): Usuario[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USUARIOS);
  return data ? JSON.parse(data) : [];
};

export const saveUsuario = (usuario: Usuario): void => {
  const usuarios = getUsuarios();
  const index = usuarios.findIndex(u => u.id === usuario.id);
  if (index >= 0) {
    usuarios[index] = usuario;
  } else {
    usuarios.push(usuario);
  }
  localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(usuarios));
};

export const getUsuarioById = (id: string): Usuario | undefined => {
  return getUsuarios().find(u => u.id === id);
};

// Pets
export const getPets = (): Pet[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PETS);
  return data ? JSON.parse(data) : [];
};

export const savePet = (pet: Pet): void => {
  const pets = getPets();
  const index = pets.findIndex(p => p.id === pet.id);
  if (index >= 0) {
    pets[index] = pet;
  } else {
    pets.push(pet);
  }
  localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets));
};

export const getPetById = (id: string): Pet | undefined => {
  return getPets().find(p => p.id === id);
};

export const getPetsByUsuario = (usuarioId: string): Pet[] => {
  return getPets().filter(p => p.usuarioId === usuarioId);
};

// Reservas
export const getReservas = (): Reserva[] => {
  const data = localStorage.getItem(STORAGE_KEYS.RESERVAS);
  return data ? JSON.parse(data) : [];
};

export const saveReserva = (reserva: Reserva): void => {
  const reservas = getReservas();
  const index = reservas.findIndex(r => r.id === reserva.id);
  if (index >= 0) {
    reservas[index] = reserva;
  } else {
    reservas.push(reserva);
  }
  localStorage.setItem(STORAGE_KEYS.RESERVAS, JSON.stringify(reservas));
};

export const getReservaById = (id: string): Reserva | undefined => {
  return getReservas().find(r => r.id === id);
};

export const getReservasByUsuario = (usuarioId: string): Reserva[] => {
  return getReservas().filter(r => r.usuarioId === usuarioId);
};

// Usuário atual
export const getCurrentUser = (): Usuario | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (usuario: Usuario | null): void => {
  if (usuario) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(usuario));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Gerar ID único
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
