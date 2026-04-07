import React from 'react';
import { createBrowserRouter } from 'react-router';
import { Home } from './pages/Home';
import { Hotel } from './pages/Hotel';
import { QuemSomos } from './pages/QuemSomos';
import { Contatos } from './pages/Contatos';
import { Login } from './pages/Login';
import { CadastroUsuario } from './pages/CadastroUsuario';
import { CadastroPet } from './pages/CadastroPet';
import { MinhasReservas } from './pages/MinhasReservas';
import { Admin } from './pages/Admin';
import { Layout } from './components/Layout';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Home /></Layout>,
  },
  {
    path: '/hotel',
    element: <Layout><Hotel /></Layout>,
  },
  {
    path: '/quem-somos',
    element: <Layout><QuemSomos /></Layout>,
  },
  {
    path: '/contatos',
    element: <Layout><Contatos /></Layout>,
  },
  {
    path: '/login',
    element: <Layout><Login /></Layout>,
  },
  {
    path: '/cadastro-usuario',
    element: <Layout><CadastroUsuario /></Layout>,
  },
  {
    path: '/cadastro-pet',
    element: <Layout><CadastroPet /></Layout>,
  },
  {
    path: '/minhas-reservas',
    element: <Layout><MinhasReservas /></Layout>,
  },
  {
    path: '/admin',
    element: <Layout><Admin /></Layout>,
  },
  {
    path: '*',
    element: <Layout><NotFound /></Layout>,
  },
]);