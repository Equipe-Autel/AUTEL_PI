import { Router, type Request, type Response } from 'express'
import { userLogin } from "./service"
import { resourceLimits } from 'node:worker_threads'

const express = require('express')
const app = express()

app.post('/user/login', async (req: Request,res: Response) => {

    try {
        const {email, senha} = req.body
        const resultLogin = await userLogin(email, senha)
        res.status(200).json(resultLogin)
    } catch (error) {
        res.status(401).json({ error: error.message })
    }

    //Recebe user e password do front ->
    //Verifica se o login existe e se está correto -> 
    //User e password passam pelo JWT para virarem tokens e seta algumas configurações do token ->
    //Devolve o token para ir para o middleware ser autenticado

    
})