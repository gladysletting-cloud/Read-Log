import { useState } from "react";

function Search(){
    const [query, setQuery]= useState('')
    const [books, setBooks]= useState([])
    const [loading, setLoading]= useState(false)
    const [error, setError]= useState('')
    const [searched, setSearched]= useState(false)

    async function handleSearch(e){
        e.preventDefault()

        if(query.trim() ==='') {
            return
        }
        setLoading(true)
        setError('')

        try{
            const response = await Fetch(
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
          </li>
        ))}
      </ul>
    </div>
  )
}
export default Search