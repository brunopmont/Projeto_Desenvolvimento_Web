import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routes/router.tsx'
import './index.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* O App foi substituído pelo RouterProvider  */}
    <RouterProvider router={router} />
  </React.StrictMode>,
)