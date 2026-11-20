import { useNavigate } from "react-router-dom"
import { useAuth } from "../components/AuthContext"

function Library() {
    const {user, logout} =useAuth()
    const navigate= useNavigate

    async function handleLogout() {
        await logout()
        navigate('/login')
    }
    return(
        <div className="p-6">
            <h1 className="text-2xl font-bold">Library page</h1>
            <p className="mt-2">Signed in as {user.email}</p>
            <button 
                onClick={handleLogout}
                className="mt-4 rounded bg-indigo-600 px-4 py-2 text=white"
            >
                Logout
            </button>
        </div>
    )
}

export default Library