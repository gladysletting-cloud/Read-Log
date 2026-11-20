import { createContext, useContext, useEffect, useState } from 'react'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    updateProfile,
} from 'firebase/auth'
import { auth, googleProvider} from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({children}){
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) =>{
            setUser(currentUser)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    const register = async (name, email, password) => {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(result.user, { displayName: name })
        return result
    }
    const login = (email, password) =>
        signInWithEmailAndPassword(auth, email, password)

    const loginWithGoogle = () => signInWithPopup(auth, googleProvider)

    const logout = () => signOut(auth)

    const value = { user, loading, register, login, loginWithGoogle, logout }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used inside an AuthProvider')
    }
    return context
}