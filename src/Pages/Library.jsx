import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../components/AuthContext"
import { useEffect, useState } from "react"
import { getBooks } from "../bookService"

function Library() {
    const {user, logout} =useAuth()
    const navigate= useNavigate()

    const [books, setBooks]= useState([])
    const [loading, setLoading]= useState(true)
    const [error, setError]= useState('')

    useEffect(() =>{
        async function loadBooks(){
            try{
                const list = await getBooks(user.uid)
                setBooks(list)
            }catch(err){
              console.log(err)
              setError('Could not load your books. Please try again.')
            }
            setLoading(false)
        }
        loadBooks()
    }, [user.uid])

    async function handleLogout() {
        await logout()
        navigate('/login')
    }
    return(
        <div className="p-6">
            <h1 className="text-2xl font-bold">Library page</h1>
            <p className="mt-2">Signed in as {user.email}</p>

            <Link to="/search" className="mt-4 block text-indigo-600 underline">
              Search for books
            </Link>

            {loading && <p className="mt-4">Loading your books...</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
            {!loading && !error && books.length === 0 &&(
                <p className="mt-4">No books yet. Search for a book to add one.</p>
            )}

            <ul className="mt-4 space-y-3">
                {books.map((book) =>(
                    <li key={book.id} className="rounded border border-gray-300 p">
                        <p className="font-bold">{book.title}</p>
                        <p>{book.author}</p>
                        <p className="text-sm text-gray-500">{book.year}</p>
                        <p className="mt-1 text-sm">Status: {book.status}</p>
                    </li>
                ))}
            </ul>

            <button 
                onClick={handleLogout}
                className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white"
            >
                Logout
            </button>
        </div>
    )
}

export default Library