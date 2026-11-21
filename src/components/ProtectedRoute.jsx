import{ Navigate} from 'react-router-dom'
import {useAuth} from './AuthContext'
import Navbar from './Navbar'

function ProtectedRoute({children}){
    const {user, loading} = useAuth()

    if(loading){
        return <p className="p-6">Loading...</p>
    }
    if(!user){
        return <Navigate to="/login" />
    }
    return (
        <div>
            <Navbar />
            {children}
        </div>
    )
}
export default ProtectedRoute