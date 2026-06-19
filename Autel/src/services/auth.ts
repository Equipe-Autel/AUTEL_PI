import { API_URL } from './api';
import { Usuario } from '../types';

export function mapUserFromBackend(data: any, isAdmin = false): Usuario {
  return {
    id: data.id,
    nome: data.nome,
    sobrenome: data.sobrenome || '',
    email: data.email || data.codFunc || '',
    cpf: data.cpf || '',
    telefone: data.telefone || '',
    logradouro: data.endereco?.logradouro || '',
    numero: data.endereco?.numero || '',
    complemento: data.endereco?.complemento || '',
    bairro: data.endereco?.bairro || '',
    cidade: data.endereco?.cidade || '',
    estado: data.endereco?.estado || '',
    contatoEmergencia: data.contato_emergencia || '',
    telefoneEmergencia: data.telefone_emergencia || '',
    isAdmin: isAdmin || data.role === 'ADMIN',
  };
}

export async function apiLogin(email: string, senha: string): Promise<{ token: string; usuario: Usuario }> {
  // Se começar com "adm" (ex: ADM001) ou contiver "admin", tenta o login de admin
  const isAdmin = email.toLowerCase().startsWith('adm') || email.toLowerCase().includes('admin');
  const endpoint = isAdmin ? '/auth/admin/login' : '/auth/user/login';
  
  const payload = isAdmin 
    ? { codFunc: email.toUpperCase(), senha } 
    : { email: email.toLowerCase(), senha };

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Erro ao realizar login.');
  }

  // Se logar como admin, o payload retornado tem nome e codFunc
  const mappedUser = isAdmin 
    ? mapUserFromBackend({ id: data.id, nome: 'Administrador', codFunc: data.codFunc, role: 'ADMIN' }, true)
    : mapUserFromBackend(data); // Para o usuário comum, o login do backend retorna apenas { token, id, role, email }, mas vamos carregar o perfil completo no AppContext.

  return {
    token: data.token,
    usuario: {
      ...mappedUser,
      id: String(data.id),
      email: data.email || data.codFunc,
    },
  };
}

export async function apiFetchProfile(id: string, token: string, isAdmin = false): Promise<Usuario> {
  if (isAdmin) {
    return mapUserFromBackend({ id, nome: 'Administrador', codFunc: 'ADM001', role: 'ADMIN' }, true);
  }

  const endpoint = `/users/${id}`;
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Erro ao obter dados do perfil.');
  }

  return mapUserFromBackend(data, isAdmin);
}

export async function apiRegister(usuario: Omit<Usuario, 'id'>): Promise<Usuario> {
  const payload = {
    nome: usuario.nome,
    sobrenome: usuario.sobrenome,
    cpf: usuario.cpf.replace(/\D/g, ''), // Limpa caracteres especiais
    telefone: usuario.telefone.replace(/\D/g, ''), // Limpa caracteres especiais
    email: usuario.email.toLowerCase(),
    senha: usuario.senha,
    contato_emergencia: usuario.contatoEmergencia || null,
    telefone_emergencia: usuario.telefoneEmergencia ? usuario.telefoneEmergencia.replace(/\D/g, '') : null,
    endereco: {
      logradouro: usuario.logradouro,
      bairro: usuario.bairro,
      cidade: usuario.cidade,
      estado: usuario.estado,
      numero: usuario.numero || null,
      complemento: usuario.complemento || null,
    }
  };

  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Erro ao realizar cadastro.');
  }

  return mapUserFromBackend(data);
}

export async function apiDeleteUser(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error?.message || 'Erro ao remover usuário.');
  }
}

export async function apiUpdateUser(id: string, user: Partial<Usuario>, token: string): Promise<Usuario> {
  const payload: any = {};
  if (user.nome !== undefined) payload.nome = user.nome;
  if (user.sobrenome !== undefined) payload.sobrenome = user.sobrenome;
  if (user.telefone !== undefined) payload.telefone = user.telefone.replace(/\D/g, '');
  if (user.contatoEmergencia !== undefined) payload.contato_emergencia = user.contatoEmergencia || null;
  if (user.telefoneEmergencia !== undefined) payload.telefone_emergencia = user.telefoneEmergencia ? user.telefoneEmergencia.replace(/\D/g, '') : null;

  if (user.logradouro !== undefined || user.bairro !== undefined || user.cidade !== undefined || user.estado !== undefined || user.numero !== undefined || user.complemento !== undefined) {
    payload.endereco = {};
    if (user.logradouro !== undefined) payload.endereco.logradouro = user.logradouro;
    if (user.bairro !== undefined) payload.endereco.bairro = user.bairro;
    if (user.cidade !== undefined) payload.endereco.cidade = user.cidade;
    if (user.estado !== undefined) payload.endereco.estado = user.estado;
    if (user.numero !== undefined) payload.endereco.numero = user.numero || null;
    if (user.complemento !== undefined) payload.endereco.complemento = user.complemento || null;
  }

  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Erro ao atualizar dados do usuário.');
  }
  return mapUserFromBackend(data);
}

export async function apiCreateAdmin(
  dados: { cod_funcionario: string; nome: string; cargo: string; senha: string },
  token: string
): Promise<{ id: string; cod_funcionario: string; nome: string; cargo: string }> {
  const response = await fetch(`${API_URL}/users/admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Erro ao criar administrador.');
  }
  return data;
}

export async function apiListAllUsers(token: string): Promise<Usuario[]> {
  const response = await fetch(`${API_URL}/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Erro ao carregar lista de usuários.');
  }

  return Array.isArray(data) ? data.map(u => mapUserFromBackend(u)) : [];
}
