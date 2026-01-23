import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'

import LogIn from './components/LogIn/LogIn'
import NotFound from './components/NotFound/NotFound'
import Home from './components/Home/Home.jsx'
import Register from './components/Register/Register.jsx'
import CarsList from './components/Cars/CarsList.jsx'
import CarForm from './components/Cars/CarForm.jsx'
import CarDetail from './components/Cars/CarDetail.jsx'
import ClientsList from './components/Clients/ClientsList.jsx'
import ClientForm from './components/Clients/ClientForm.jsx'
import ClientDetail from './components/Clients/ClientDetail.jsx'
import SalesList from './components/Sales/SalesList.jsx'
import SaleForm from './components/Sales/SaleForm.jsx'
import SaleDetail from './components/Sales/SaleDetail.jsx'
import LoginRequired from './components/LogIn/LogInRequired.jsx'
import UsersList from './components/Users/UsersList.jsx'
import UserDetail from './components/Users/UserDetail.jsx'
import Profile from './components/Users/Profile.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="login" element={<LogIn />} />
            <Route path="cars" element={<CarsList />} />
            <Route element={<LoginRequired />}>
              <Route path="register" element={<Register />} />
              <Route path="cars/new" element={<CarForm />} />
              <Route path="cars/:vin" element={<CarDetail />} />
              <Route path="/clients" element={<ClientsList />} />
              <Route path="/clients/new" element={<ClientForm />} />
              <Route path="/clients/:id" element={<ClientDetail />} />
              <Route path="/sales" element={<SalesList />} />
              <Route path="/sales/new" element={<SaleForm />} />
              <Route path="/sales/:id" element={<SaleDetail />} />
              <Route path="/sales/:id/edit" element={<SaleForm />} />
              <Route path="/users" element={<UsersList />} />
              <Route path="/users/:id" element={<UserDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)