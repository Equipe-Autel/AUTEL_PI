import jwt from 'jsonwebtoken'

const roles = ['USUARIO', 'ADMIN'];
type RolesENUM = typeof roles[number];

interface JwtPayload{
    id: string,
    role: RolesENUM
}

export function jwtEncode(payload: JwtPayload, secret: string) {
   
    if (!payload?.id || !payload?.role) throw new Error('Payload deve conter id e role');
    if (!roles.includes(payload.role)) throw new Error('Role inválida');
    if (!secret) throw new Error ('Secret não pode ser nulo');
    
    const token = jwt.sign(payload, secret, {
        expiresIn: '30d'
    });

    return { token, id: payload.id, role: payload.role }
};

