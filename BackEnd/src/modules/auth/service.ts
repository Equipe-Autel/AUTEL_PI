import { prisma } from '../../lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function login(email: string, senha:string){

        if (!email || !senha) throw new Error('Email e senha são obrigatórios');

        const usuario = await prisma.user.findUnique({
            where: { email },
        });

        if (!usuario) { throw new Error ('Usuário ou senha incorretos') };

        const match = await bcrypt.compare(senha, usuario.hashedPassword);

        if (!match) throw new Error ('Usuário ou senha incorretos')

        const token = jwt.sign(
            {id: usuario.id, role: "USUARIO"},
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );
        
        return { token, usuario: usuario.id, email: usuario.email};
        
    
}