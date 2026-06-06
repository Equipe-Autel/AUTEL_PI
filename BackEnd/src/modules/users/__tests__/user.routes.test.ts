import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../../../app'
import * as userRepository from '../user.repository'

vi.mock('../../../shared/prisma', () => ({ prisma: {} }))
vi.mock('../user.repository')
vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('$2b$10$hashed'),
  },
}))

const JWT_SECRET = 'test-secret-key'

function makeToken(id: string, role: 'USUARIO' | 'ADMIN') {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '1h' })
}

const mockUser = {
  id: BigInt(1),
  nome: 'João',
  sobrenome: 'Silva',
  email: 'joao@test.com',
  cpf: '12345678901',
  telefone: '11999999999',
  senha: '$2b$10$hashed',
  contato_emergencia: null,
  telefone_emergencia: null,
  endereco_id: 1,
  endereco: {
    id: 1,
    logradouro: 'Rua das Flores',
    numero: null,
    complemento: null,
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
  },
}

const expectedResponse = {
  id: '1',
  nome: 'João',
  sobrenome: 'Silva',
  email: 'joao@test.com',
  cpf: '12345678901',
  telefone: '11999999999',
  contato_emergencia: null,
  telefone_emergencia: null,
  endereco: mockUser.endereco,
}

const validCreateBody = {
  nome: 'João',
  sobrenome: 'Silva',
  email: 'joao@test.com',
  cpf: '12345678901',
  telefone: '11999999999',
  senha: 'senha123',
  endereco: {
    logradouro: 'Rua das Flores',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
  },
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ─── POST /users ────────────────────────────────────────────────────────────

describe('POST /users', () => {
  it('retorna 201 e o usuário criado', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null)
    vi.mocked(userRepository.findByCpf).mockResolvedValue(null)
    vi.mocked(userRepository.createUser).mockResolvedValue(mockUser as any)

    const res = await request(app).post('/users').send(validCreateBody)

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject(expectedResponse)
  })

  it('retorna 422 quando campos obrigatórios estão faltando', async () => {
    const res = await request(app).post('/users').send({ nome: 'João' })

    expect(res.status).toBe(422)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('retorna 422 quando endereço está incompleto', async () => {
    const res = await request(app)
      .post('/users')
      .send({ ...validCreateBody, endereco: { logradouro: 'Rua X' } })

    expect(res.status).toBe(422)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('retorna 409 quando email já está cadastrado', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser as any)
    vi.mocked(userRepository.findByCpf).mockResolvedValue(null)

    const res = await request(app).post('/users').send(validCreateBody)

    expect(res.status).toBe(409)
    expect(res.body.error.code).toBe('CONFLICT')
  })

  it('retorna 409 quando CPF já está cadastrado', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null)
    vi.mocked(userRepository.findByCpf).mockResolvedValue(mockUser as any)

    const res = await request(app).post('/users').send(validCreateBody)

    expect(res.status).toBe(409)
    expect(res.body.error.code).toBe('CONFLICT')
  })
})

// ─── GET /users/:id ──────────────────────────────────────────────────────────

describe('GET /users/:id', () => {
  it('retorna 200 quando USUARIO acessa seus próprios dados', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(mockUser as any)

    const token = makeToken('1', 'USUARIO')
    const res = await request(app)
      .get('/users/1')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject(expectedResponse)
  })

  it('retorna 200 quando ADMIN acessa dados de qualquer usuário', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(mockUser as any)

    const token = makeToken('99', 'ADMIN')
    const res = await request(app)
      .get('/users/1')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject(expectedResponse)
  })

  it('retorna 403 quando USUARIO acessa dados de outro usuário', async () => {
    const token = makeToken('2', 'USUARIO')
    const res = await request(app)
      .get('/users/1')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(403)
    expect(res.body.error.code).toBe('FORBIDDEN')
  })

  it('retorna 401 sem token', async () => {
    const res = await request(app).get('/users/1')

    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('UNAUTHORIZED')
  })

  it('retorna 404 quando usuário não existe', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(null)

    const token = makeToken('1', 'USUARIO')
    const res = await request(app)
      .get('/users/1')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('NOT_FOUND')
  })
})

// ─── PUT /users/:id ──────────────────────────────────────────────────────────

describe('PUT /users/:id', () => {
  const updateBody = { nome: 'João Atualizado' }

  it('retorna 200 quando usuário atualiza seus próprios dados', async () => {
    const updatedUser = { ...mockUser, nome: 'João Atualizado' }
    vi.mocked(userRepository.findById).mockResolvedValue(mockUser as any)
    vi.mocked(userRepository.updateUser).mockResolvedValue(updatedUser as any)

    const token = makeToken('1', 'USUARIO')
    const res = await request(app)
      .put('/users/1')
      .set('Authorization', `Bearer ${token}`)
      .send(updateBody)

    expect(res.status).toBe(200)
    expect(res.body.nome).toBe('João Atualizado')
  })

  it('retorna 403 quando usuário tenta atualizar outro usuário', async () => {
    const token = makeToken('2', 'USUARIO')
    const res = await request(app)
      .put('/users/1')
      .set('Authorization', `Bearer ${token}`)
      .send(updateBody)

    expect(res.status).toBe(403)
    expect(res.body.error.code).toBe('FORBIDDEN')
  })

  it('retorna 401 sem token', async () => {
    const res = await request(app).put('/users/1').send(updateBody)

    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('UNAUTHORIZED')
  })

  it('retorna 404 quando usuário não existe', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(null)

    const token = makeToken('1', 'USUARIO')
    const res = await request(app)
      .put('/users/1')
      .set('Authorization', `Bearer ${token}`)
      .send(updateBody)

    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('NOT_FOUND')
  })
})

// ─── DELETE /users/:id ───────────────────────────────────────────────────────

describe('DELETE /users/:id', () => {
  it('retorna 204 quando usuário deleta sua própria conta', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(mockUser as any)
    vi.mocked(userRepository.deleteUser).mockResolvedValue(mockUser as any)

    const token = makeToken('1', 'USUARIO')
    const res = await request(app)
      .delete('/users/1')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(204)
  })

  it('retorna 204 quando ADMIN deleta qualquer conta', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(mockUser as any)
    vi.mocked(userRepository.deleteUser).mockResolvedValue(mockUser as any)

    const token = makeToken('99', 'ADMIN')
    const res = await request(app)
      .delete('/users/1')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(204)
  })

  it('retorna 403 quando USUARIO tenta deletar outro usuário', async () => {
    const token = makeToken('2', 'USUARIO')
    const res = await request(app)
      .delete('/users/1')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(403)
    expect(res.body.error.code).toBe('FORBIDDEN')
  })

  it('retorna 401 sem token', async () => {
    const res = await request(app).delete('/users/1')

    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('UNAUTHORIZED')
  })

  it('retorna 404 quando usuário não existe', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(null)

    const token = makeToken('1', 'USUARIO')
    const res = await request(app)
      .delete('/users/1')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('NOT_FOUND')
  })
})
