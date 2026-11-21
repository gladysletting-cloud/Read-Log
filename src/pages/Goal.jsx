import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import { getGoal, saveGoal, deleteGoal } from '../services/goalService'
import { getBooks } from '../services/bookService'

function Goal() {
  const { user } = useAuth()

  const [goal, setGoal] = useState(null)
  const [finished, setFinished] = useState(0)
  const [target, setTarget] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const savedGoal = await getGoal(user.uid)
        const books = await getBooks(user.uid)

        const finishedBooks = books.filter((book) => book.status === 'Finished')

        setGoal(savedGoal)
        setFinished(finishedBooks.length)

        if (savedGoal) {
          setTarget(String(savedGoal.target))
        }
      } catch (err) {
        console.log(err)
        setError('Could not load your goal. Please try again.')
      }
      setLoading(false)
    }

    loadData()
  }, [user.uid])

  async function handleSave(e) {
    e.preventDefault()
    setError('')

    const number = Number(target)

    if (!number || number < 1) {
      setError('Enter a number of books, 1 or more.')
      return
    }

    try {
      await saveGoal(user.uid, number)
      setGoal({ target: number, year: new Date().getFullYear() })
    } catch (err) {
      console.log(err)
      setError('Could not save your goal. Please try again.')
    }
  }

  async function handleDelete() {
    const sure = window.confirm('Delete your reading goal?')
    if (!sure) {
      return
    }

    setError('')

    try {
      await deleteGoal(user.uid)
      setGoal(null)
      setTarget('')
    } catch (err) {
      console.log(err)
      setError('Could not delete your goal. Please try again.')
    }
  }

  let percent = 0
  if (goal) {
    percent = Math.min(100, Math.round((finished / goal.target) * 100))
  }

  return (
    <main className="p-6 mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-indigo-800">Reading Goal</h1>

      {loading && <p className="mt-4">Loading your goal...</p>}

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {!loading && !goal && (
        <p className="mt-4">No goal yet. Set one below.</p>
      )}

      {!loading && goal && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p>
            You have finished {finished} of {goal.target} books in {goal.year}.
          </p>

          <div className="mt-2 h-4 w-full rounded bg-gray-200">
            <div
              className="h-4 rounded bg-amber-500"
              style={{ width: percent + '%' }}
            ></div>
          </div>

          <p className="mt-1 text-sm text-gray-600">{percent}% done</p>
        </div>
      )}

      {!loading && (
        <form 
          onSubmit={handleSave} 
          className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <label htmlFor="target" className="block text-sm font-medium">
            How many books do you want to read this year?
          </label>
          <input
            id="target"
            type="number"
            min="1"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="mt-1 w-32 rounded border border-gray-300 px-3 py-2"
          />
          <button
            type="submit"
            className="ml-3 ml-3 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 bg-indigo-600 px-4 py-2 text-white"
          >
            {goal ? 'Update goal' : 'Save goal'}
          </button>
        </form>
      )}

      {!loading && goal && (
        <button
          onClick={handleDelete}
          className="mt-4 mt-4 rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 bg-red-600 px-3 py-1 text-white"
        >
          Delete goal
        </button>
      )}
    </main>
  )
}

export default Goal