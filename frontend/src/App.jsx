import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import CapitalGains from './pages/CapitalGains'
import ForeignAssets from './pages/ForeignAssets'


function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/transactions"
          element={<Transactions />}
        />

        <Route
          path="/capital-gains"
          element={<CapitalGains />}
        />

        <Route
          path="/foreign-assets"
          element={<ForeignAssets />}
        />

      </Routes>

    </BrowserRouter>
  )
}


export default App