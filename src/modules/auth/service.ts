import { prisma } from '../../lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function login(email: string, senha:string){
    try {
        const usuario = await prisma.user.findUnique({
            where: { email },
        });

        if (!email) throw new Error ('Usuário não encontrado');

        const match = await bcrypt.compare(senha, usuario.hashedPasssword);

        if (!match) throw new Error ('Senha incorreta!')


        // Implementar JWT para retornar o token validado
             
        
    } catch (error) {
        
    }
}