import { API_URL } from './api';
import { Reserva, Plano } from '../types';

export function mapPlanoFromBackend(data: any): Plano {
  return {
    id: String(data.id),
    nome: data.nome,
    descricao: data.descricao,
    preco: Number(data.valor_diaria),
  };
}

export function mapReservaFromBackend(data: any, planos: Plano[]): Reserva {
  const plano = planos.find(p => p.id === String(data.plano_id));
  const tipoAcomodacao = plano ? plano.nome : 'Standard';

  const alimentacaoMap: Record<string, 'Tutor' | 'Hotel'> = {
    'TUTOR': 'Tutor',
    'HOTEL': 'Hotel',
  };
  const responsavelAlimentacao = alimentacaoMap[data.alimentacao?.toUpperCase()] || 'Hotel';

  const statusMap: Record<string, 'Ativa' | 'Cancelada' | 'Finalizada'> = {
    'ATIVA': 'Ativa',
    'CANCELADA': 'Cancelada',
    'FINALIZADA': 'Finalizada',
  };
  const status = statusMap[data.status_reserva?.toUpperCase()] || 'Ativa';

  return {
    id: data.id.toString(),
    petId: data.pet_id.toString(),
    usuarioId: data.usuario_id.toString(),
    dataEntrada: data.checkin,
    dataSaidaPrevista: data.checkout,
    dataSaida: data.data_horario_saida || undefined,
    responsavelAlimentacao,
    tipoAcomodacao,
    observacoesComida: data.observacoes || '',
    status,
    valorTotal: Number(data.valor_total),
    dataCadastro: data.data_reserva,
  };
}

export async function apiListPlans(): Promise<Plano[]> {
  const response = await fetch(`${API_URL}/plans`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Erro ao carregar planos.');
  }
  return Array.isArray(data) ? data.map(mapPlanoFromBackend) : [];
}

export async function apiCreateReservation(reserva: Omit<Reserva, 'id' | 'dataCadastro'>, planoId: number, token: string): Promise<any> {
  const payload = {
    checkin: reserva.dataEntrada,
    checkout: reserva.dataSaidaPrevista,
    alimentacao: reserva.responsavelAlimentacao.toUpperCase(),
    plano_id: planoId,
    pet_id: reserva.petId,
    observacoes: reserva.observacoesComida || null,
  };

  const response = await fetch(`${API_URL}/reservations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Erro ao criar reserva.');
  }
  return data;
}

export async function apiListMyReservations(token: string): Promise<any[]> {
  const response = await fetch(`${API_URL}/reservations/minhas`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Erro ao carregar reservas.');
  }
  return Array.isArray(data) ? data : [];
}

export async function apiListAllReservations(token: string): Promise<any[]> {
  const response = await fetch(`${API_URL}/reservations/todas`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Erro ao carregar todas as reservas.');
  }
  return Array.isArray(data) ? data : [];
}

export async function apiCancelReservation(id: string, token: string): Promise<any> {
  const response = await fetch(`${API_URL}/reservations/${id}/cancelar`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Erro ao cancelar reserva.');
  }
  return data;
}

export async function apiUpdateReservation(id: string, reserva: Partial<Reserva>, planoId: number | undefined, token: string): Promise<any> {
  const payload: any = {};
  if (reserva.dataEntrada) payload.checkin = reserva.dataEntrada;
  if (reserva.dataSaidaPrevista) payload.checkout = reserva.dataSaidaPrevista;
  if (reserva.responsavelAlimentacao) payload.alimentacao = reserva.responsavelAlimentacao.toUpperCase();
  if (planoId !== undefined) payload.plano_id = planoId;
  if (reserva.observacoesComida !== undefined) payload.observacoes = reserva.observacoesComida;

  const response = await fetch(`${API_URL}/reservations/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Erro ao atualizar reserva.');
  }
  return data;
}

export async function apiCreatePlan(plano: Omit<Plano, 'id'>, token: string): Promise<Plano> {
  const response = await fetch(`${API_URL}/plans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      nome: plano.nome,
      valor_diaria: plano.preco,
      descricao: plano.descricao
    })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Erro ao criar plano.');
  }
  return mapPlanoFromBackend(data);
}

export async function apiUpdatePlan(id: string, plano: Partial<Omit<Plano, 'id'>>, token: string): Promise<Plano> {
  const payload: any = {};
  if (plano.nome !== undefined) payload.nome = plano.nome;
  if (plano.preco !== undefined) payload.valor_diaria = plano.preco;
  if (plano.descricao !== undefined) payload.descricao = plano.descricao;

  const response = await fetch(`${API_URL}/plans/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Erro ao atualizar plano.');
  }
  return mapPlanoFromBackend(data);
}

export async function apiDeletePlan(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/plans/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error?.message || 'Erro ao deletar plano.');
  }
}

