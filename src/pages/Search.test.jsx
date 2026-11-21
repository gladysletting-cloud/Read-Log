import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Search from './Search'
import { addBook } from '../services/bookService'

vi.mock('../components/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'user1' } }),
}))

vi.mock('../services/bookService', () => ({
  addBook: vi.fn(),
}))

const sampleBook = {
  key: '/works/OL1W',
  title: 'Things Fall Apart',
  author_name: ['Chinua Achebe'],
  first_publish_year: 1958,
}

let fetchMock

function mockBooks(docs) {
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => ({ docs: docs }),
  })
}

async function searchFor(text) {
  render(<Search />)
  await userEvent.type(
    screen.getByLabelText('Search by title or author'),
    text
  )
  await userEvent.click(screen.getByRole('button', { name: 'Search' }))
}

describe('Search page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the books that match the search', async () => {
    mockBooks([sampleBook])

    await searchFor('achebe')

    expect(await screen.findByText('Things Fall Apart')).toBeInTheDocument()
    expect(screen.getByText('Chinua Achebe')).toBeInTheDocument()
  })

  it('shows a message when no books are found', async () => {
    mockBooks([])

    await searchFor('zzzzqqqq')

    expect(await screen.findByText('No books found.')).toBeInTheDocument()
  })

  it('shows an error when the search fails', async () => {
    fetchMock.mockRejectedValue(new Error('No internet'))

    await searchFor('achebe')

    expect(
      await screen.findByText('Could not load books. Please try again.')
    ).toBeInTheDocument()
  })

  it('does not search when the box is empty', async () => {
    render(<Search />)

    await userEvent.click(screen.getByRole('button', { name: 'Search' }))

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('adds a book to the library', async () => {
    mockBooks([sampleBook])
    addBook.mockResolvedValue()

    await searchFor('achebe')
    await userEvent.click(
      await screen.findByRole('button', { name: 'Add to library' })
    )

    expect(addBook).toHaveBeenCalledWith('user1', {
      title: 'Things Fall Apart',
      author: 'Chinua Achebe',
      year: 1958,
      status: 'Want to Read',
    })
    expect(
      await screen.findByText('Added Things Fall Apart to your library.')
    ).toBeInTheDocument()
  })

  it('uses Unknown author and an empty year when the data is missing', async () => {
    mockBooks([{ key: '/works/OL2W', title: 'Mystery Book' }])
    addBook.mockResolvedValue()

    await searchFor('mystery')
    await userEvent.click(
      await screen.findByRole('button', { name: 'Add to library' })
    )

    expect(addBook).toHaveBeenCalledWith('user1', {
      title: 'Mystery Book',
      author: 'Unknown author',
      year: '',
      status: 'Want to Read',
    })
  })

  it('shows an error when the book cannot be added', async () => {
    mockBooks([sampleBook])
    addBook.mockRejectedValue(new Error('Firebase failed'))

    await searchFor('achebe')
    await userEvent.click(
      await screen.findByRole('button', { name: 'Add to library' })
    )

    expect(
      await screen.findByText('Could not add the book. Please try again.')
    ).toBeInTheDocument()
  })
})