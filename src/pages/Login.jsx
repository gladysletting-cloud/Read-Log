import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'

function getErrorMessage(error) {
    switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
            return 'Invalid email or password.'
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.'
        case 'auth/weak-password':
            return 'Password must be at least 6 characters.'
        case 'auth/invalid-email':
            return 'Enter a valid email address.'
        case 'auth/popup-closed-by-user':
            return 'Google sign-in was cancelled.'
        default:
            return 'Something went wrong. Please try again.'

    }
}
const inputClass = 'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'

function Login() {
    const { login, register, loginWithGoogle } = useAuth()
    const navigate = useNavigate()

    const [mode, setMode] = useState('login')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const isRegister = mode === 'register'

    const switchMode = (newMode) => {
        setMode(newMode)
        setError('')
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (isRegister && !name.trim()) {
            setError('Enter your name.')
            return
        }
        setSubmitting(true)
        try {
            if (isRegister) {
                await register(name.trim(), email, password)
            } else {
                await login(email, password)
            }
            navigate('/library')
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setSubmitting(false)
        }
    }
    const handleGoogle = async () => {
        setError('')
        try {
            await loginWithGoogle()
            navigate('/library')
        } catch (err) {
            setError(getErrorMessage(err))
        }
    }
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md round-xl bg-white p-8 shadow">
                <h1 className="text-center text-2xl font-bold">Read-Log</h1>
                <p className="mt-1 text-center text-sm text-gray=500">
                    Track your Books and reading goals
                </p>
                <div className="mt-6 border-b" role="tablist">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={!isRegister}
                      onClick={() => switchMode('login')}
                      className={`flex-1 pb-2 font-medium ${!isRegister ? 'border-b-2 border-indigo-600 text-indigo-600':'text-gray-400'}`}
                    >
                        Login
                    </button>
                    <button
                    type="button"
                    role="tab"
                    aria-selected={isRegister}
                    onClick={() =>switchMode('register')}
                    className={`flex-1 pb-2 font-medium ${isRegister ? 'border-b-2 border-indigo-600 text-indigo-600' :'text-gray-400'}`}
                    >
                        Register
                    </button>
                </div>
                {error &&(
                    <p
                    role="alert"
                    className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700"
                    > {error} </p>
                )}

            <form onSubmit= {handleSubmit} className="mt-4 space-y-4">
                {isRegister &&(
                    <div>
                        <label htmlFor="name" className="text-sm font-medium">Name</label>
                        <input type="text" id="name" value={name} onChange={(e)=> setName(e.target.value)}className={inputClass} />
                    </div>
                )}
                <div>
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                     <input type="email" id="email" required value={email} onChange={(e)=> setEmail(e.target.value)}className={inputClass} />
                </div>
                 <div>
                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                     <input type="password" id="password" required minLength={6} onChange={(e)=> setPassword(e.target.value)} className={inputClass} />
                </div>
                <button  type="submit" disabled={submitting} 
                 className="w-full rounded-lg bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                > {submitting ? 'Please wait...' : isRegister ? 'Create account' : 'Login'}
                </button>
            
                    <button type="button" onClick={handleGoogle}
                        className="w-full rounded-lg border border-gray-300 py-2 font-medium hover:bg-gray-50 mt-4"
                    >
                        Continue with Google
                    </button>
            </form>
            </div>
        </main>
    )
}
export default Login