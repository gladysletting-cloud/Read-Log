import { useState } from "react";
import { useAuth } from "../components/AuthContext";
import { addBook } from "../bookService";

function Search(){
    const [query, setQuery]= useState('')
    const [books, setBooks]= useState([])
    const [loading, setLoading]= useState(false)
    const [error, setError]= useState('')
    const [searched, setSearched]= useState(false)
    const [message, setMessage]= useState('')
    const {user} = useAuth()

    async function handleSearch(e){
        e.preventDefault()

        if(query.trim() ==='') {
            return
        }
        setLoading(true)
        setError('')
        setMessage('')

        try{
            const response = await fetch(
                'https://openlibrary.org/search.json?q=' +
                encodeURIComponent(query) +
                '&limit=10'
            )
            if(!response.ok){
                throw new Error('Request failed')
            }
            const data= await response.json()
            setBooks(data.docs)
            setSearched(true)
        }catch (err){
            console.log(err)
            setError('Could not load books. Please try again.')
        }
        setLoading(false)
    }
    async function handleAdd(book){
      setMessage('')

      try{
        await addBook(user.uid,{
          title: book.title,
          author: book.author_name ? book.author_name[0] : 'Unknown author',
          year: book.first_publish_year || '',
          status: 'Want to read',
        })
        setMessage('Added' + book.title +'to your library.')
      }catch(err){
        console.log(err)
        setMessage('Could not add the book. Please try again.')
      }
    }
    return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Search Books</h1>

      <form onSubmit={handleSearch} className="mt-4 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or author"
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
        <button
          type="submit"
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Search
        </button>
      </form>

      {loading && <p className="mt-4">Loading...</p>}

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {message && <p className="mt-4 text-green-700">{message}</p>}

      {searched && !loading && books.length === 0 && (
        <p className="mt-4">No books found.</p>
      )}

      <ul className="mt-4 space-y-3">
        {books.map((book) => (
          <li key={book.key} className="rounded border border-gray-300 p-3">
            <p className="font-bold">{book.title}</p>
            <p>{book.author_name ? book.author_name[0] : 'Unknown author'}</p>
            <p className="text-sm text-gray-500">
              {book.first_publish_year}
            </p>
            <button onClick={() => handleAdd(book)}
              className="mt-2 rounded bg-indigo-600 px-3 py-1 text-white"
            >
              Add to library
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default Search