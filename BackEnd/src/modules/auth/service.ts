import { prisma } from '../../lib/prisma'
import bcrypt from 'bcrypt'
import { jwtEncode } from '../../shared/jwtService';

export async function userLogin(email: string, senha:string){

        if (!email || !senha) throw new Error('Email e senha são obrigatórios');

        const usuario = await prisma.user.findUnique({
            where: { email },
        });

        if (!usuario) { throw new Error ('Usuário ou senha incorretos') };

        const match = await bcrypt.compare(senha, usuario.hashedPassword);

        if (!match) throw new Error ('Usuário ou senha incorretos');

        const { token, id, role } = jwtEncode(
            {id: usuario.id, role: usuario.role ?? 'USUARIO'},
            process.env.JWT_SECRET!
        );
        
        return { token, id, role, email: usuario.email }
        
}

export async function adminLogin(codFunc: string, senha:string){

        if (!codFunc || !senha) throw new Error('Código do funcionário e senha são obrigatórios');

        const admin = await prisma.funcionario.findUnique({
            where: { codFunc },
        });

        if (!admin) { throw new Error ('Código do funcionário ou senha incorretos') };

        const match = await bcrypt.compare(senha, admin.hashedPassword);

        if (!match) throw new Error ('Código do funcionário ou senha incorretos');

        const { token, id, role } = jwtEncode(
            {id: admin.id, role: admin.role ?? 'ADMIN'},
            process.env.JWT_SECRET!
        );
        
        return { token, id, role, codFunc: admin.codFunc }
        
}

