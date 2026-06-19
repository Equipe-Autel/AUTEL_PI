import { API_URL } from './api';
import { Pet } from '../types';

export function mapPetFromBackend(data: any): Pet {
  const dataNasc = new Date(data.data_nascimento);
  const idade = new Date().getFullYear() - dataNasc.getFullYear();

  const porteMap: Record<string, 'Pequeno' | 'Médio' | 'Grande'> = {
    'P': 'Pequeno',
    'M': 'Médio',
    'G': 'Grande'
  };
  const porte = porteMap[data.porte] || 'Médio';

  const sexoMap: Record<string, 'Macho' | 'Fêmea'> = {
    'M': 'Macho',
    'F': 'Fêmea'
  };
  const sexo = sexoMap[data.sexo] || 'Macho';
  const castrado = data.castrado === 'S';

  return {
    id: data.id.toString(),
    usuarioId: data.usuario_id.toString(),
    nome: data.nome,
    especie: data.especie as 'Cachorro' | 'Gato',
    raca: data.raca,
    idade: Math.max(0, idade),
    peso: Number(data.peso),
    observacoesSaude: data.obs_saude || '',
    porte,
    comportamento: data.comportamento as 'Calmo' | 'Agitado' | 'Agressivo',
    brincadeirasFavoritas: data.brincadeiras_favoritas || '',
    sexo,
    naturalidade: data.naturalidade || '',
    castrado,
  };
}

export function mapPetToBackend(pet: Omit<Pet, 'id'>) {
  const birthYear = new Date().getFullYear() - pet.idade;
  const data_nascimento = new Date(birthYear, 0, 1).toISOString().split('T')[0];

  const porteMap: Record<string, string> = {
    'Pequeno': 'P',
    'Médio': 'M',
    'Grande': 'G'
  };
  const porte = porteMap[pet.porte] || 'M';

  const sexoMap: Record<string, string> = {
    'Macho': 'M',
    'Fêmea': 'F'
  };
  const sexo = sexoMap[pet.sexo] || 'M';
  const castrado = pet.castrado ? 'S' : 'N';

  return {
    nome: pet.nome,
    especie: pet.especie,
    raca: pet.raca,
    data_nascimento,
    peso: pet.peso,
    porte,
    sexo,
    naturalidade: pet.naturalidade,
    comportamento: pet.comportamento,
    brincadeiras_favoritas: pet.brincadeirasFavoritas || null,
    obs_saude: pet.observacoesSaude,
    castrado,
    usuario_id: pet.usuarioId,
  };
}

export async function apiCreatePet(pet: Omit<Pet, 'id'>, token: string): Promise<Pet> {
  const payload = mapPetToBackend(pet);
  
  const response = await fetch(`${API_URL}/pets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Erro ao cadastrar pet.');
  }

  return mapPetFromBackend(data);
}

export async function apiListMyPets(token: string): Promise<Pet[]> {
  const response = await fetch(`${API_URL}/pets`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Erro ao carregar pets.');
  }

  return Array.isArray(data) ? data.map(mapPetFromBackend) : [];
}

export async function apiUpdatePet(id: string, pet: Partial<Omit<Pet, 'id'>>, token: string): Promise<Pet> {
  // Mapeamos os campos parciais do pet para o formato da API
  const mapped: Record<string, any> = {};
  if (pet.nome !== undefined) mapped.nome = pet.nome;
  if (pet.especie !== undefined) mapped.especie = pet.especie;
  if (pet.raca !== undefined) mapped.raca = pet.raca;
  if (pet.idade !== undefined) {
    const birthYear = new Date().getFullYear() - pet.idade;
    mapped.data_nascimento = new Date(birthYear, 0, 1).toISOString().split('T')[0];
  }
  if (pet.peso !== undefined) mapped.peso = pet.peso;
  if (pet.porte !== undefined) {
    const porteMap: Record<string, string> = { 'Pequeno': 'P', 'Médio': 'M', 'Grande': 'G' };
    mapped.porte = porteMap[pet.porte] || 'M';
  }
  if (pet.sexo !== undefined) {
    const sexoMap: Record<string, string> = { 'Macho': 'M', 'Fêmea': 'F' };
    mapped.sexo = sexoMap[pet.sexo] || 'M';
  }
  if (pet.comportamento !== undefined) mapped.comportamento = pet.comportamento;
  if (pet.naturalidade !== undefined) mapped.naturalidade = pet.naturalidade;
  if (pet.brincadeirasFavoritas !== undefined) mapped.brincadeiras_favoritas = pet.brincadeirasFavoritas || null;
  if (pet.observacoesSaude !== undefined) mapped.obs_saude = pet.observacoesSaude;
  if (pet.castrado !== undefined) mapped.castrado = pet.castrado ? 'S' : 'N';

  const response = await fetch(`${API_URL}/pets/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(mapped)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Erro ao atualizar pet.');
  }

  return mapPetFromBackend(data);
}

export async function apiDeletePet(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/pets/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error?.message || 'Erro ao remover pet.');
  }
}
