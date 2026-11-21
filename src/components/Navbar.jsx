import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'

function Navbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  function linkClass({ isActive }) {
    if (isActive) {
      return 'font-bold text-amber-300'
    }
    return 'text-white hover:text-amber-300'
  }

  return (
    <nav aria-label="Main" className="bg-indigo-700 px-6 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xl font-bold text-white">Read-Log</span>

        <div className="flex flex-wrap items-center gap-4">
          <NavLink to="/library" className={linkClass}>
            Library
          </NavLink>
          <NavLink to="/search" className={linkClass}>
            Search
          </NavLink>
          <NavLink to="/goal" className={linkClass}>
            Goal
          </NavLink>
          <button
            onClick={handleLogout}
            className="rounded bg-amber-500 px-3 py-1 font-medium text-indigo-900 hover:bg-amber-400"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar