import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../components/AuthContext"
import { useEffect, useState } from "react"
import { getBooks, deleteBook, updateBookStatus } from "../services/bookService"

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

    async function handleStatusChange(bookId, newStatus){
        try{
            await updateBookStatus(user.uid, bookId, newStatus)

            const newList = books.map((book) =>{
                if (book.id === bookId) {
                    return{...book, status: newStatus}
                }
                return book
            })
            setBooks(newList)
        }catch(err){
          console.log(err)
          setError('Could not change the status. Please try again.')
        }
    }

    async function handleDelete(bookId){
        const sure = window.confirm('Delete this book forom your library?')
        if (!sure){
            return
        }
        setError('')

        try{
            await deleteBook(user.uid, bookId)
            
            const newList = books.filter((book) => book.id !== bookId)
            setBooks(newList)
        }catch(err){
            console.log(err)
            setError('Could not delete the book. Please try again.')
        }
    }

    async function handleLogout() {
        await logout()
        navigate('/login')
    }
    return(
        <div className="p-6">
            <h1 className="text-2xl font-bold">My Library</h1>
            <p className="mt-2">Signed in as {user.email}</p>

            <Link to="/search" className="mt-4 block text-indigo-600 underline">
              Search for books
            </Link>

            <Link to="/goal" className="mt-2 block text-indigo-600 underline">
                My reading goal
            </Link>

            {loading && <p className="mt-4">Loading your books...</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
            {!loading && !error && books.length === 0 &&(
                <p className="mt-4">No books yet. Search for a book to add one.</p>
            )}

            <ul className="mt-4 space-y-3">
                {books.map((book) =>(
                    <li key={book.id} className="rounded border border-gray-300 p-3">
                        <p className="font-bold">{book.title}</p>
                        <p>{book.author}</p>
                        <p className="text-sm text-gray-500">{book.year}</p>

                        <label htmlFor={'status-'+ book.id} className="mt-1 text-sm">
                            Status
                        </label>
                        <select
                          id={'status-'+ book.id}
                          value={book.status}
                          onChange={(e) => handleStatusChange(book.id, e.target.value)}
                          className="rounded border border-gray-300 px-2 py-1"
                        >
                            <option value="Want to read">Want to read</option>
                            <option value="Reading">Reading</option>
                            <option value="Finished">Finished</option>
                        </select>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="mt-2 rounded bg-red-600 px-3 py-1 text-white"
                        >
                            Delete
                        </button>
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