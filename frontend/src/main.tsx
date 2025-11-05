import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routes/router.tsx'
import './index.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// trabalho feito por Bruno Porto Monteiro e Raphael Mendes Miranda Fernandes
// Mostrando apenas parte do front, já que o back é o mesmo do Trabalho 02

//ReactDOM.createRoot(document.getElementById('root')!).render(
//  <React.StrictMode>
//   {/* O App foi substituído pelo RouterProvider  */}
//    <RouterProvider router={router} />
//  </React.StrictMode>,
//)

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. "Envolva" sua aplicação com o Provider, passando o client */}
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)