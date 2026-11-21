import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Library from './Library'
import {
  getBooks,
  deleteBook,
  updateBookStatus,
} from '../services/bookService'

vi.mock('../components/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'user1', email: 'test@example.com' } }),
}))

vi.mock('../services/bookService', () => ({
  getBooks: vi.fn(),
  deleteBook: vi.fn(),
  updateBookStatus: vi.fn(),
}))

const sampleBooks = [
  {
    id: 'b1',
    title: 'Things Fall Apart',
    author: 'Chinua Achebe',
    year: 1958,
    status: 'Want to Read',
  },
  {
    id: 'b2',
    title: 'The River and the Source',
    author: 'Margaret A. Ogola',
    year: 1994,
    status: 'Reading',
  },
]

describe('Library page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows the saved books', async () => {
    getBooks.mockResolvedValue(sampleBooks)

    render(<Library />)

    expect(await screen.findByText('Things Fall Apart')).toBeInTheDocument()
    expect(screen.getByText('The River and the Source')).toBeInTheDocument()
  })

  it('shows a message when there are no books', async () => {
    getBooks.mockResolvedValue([])

    render(<Library />)

    expect(await screen.findByText(/No books yet/)).toBeInTheDocument()
  })

  it('shows an error when the books cannot be loaded', async () => {
    getBooks.mockRejectedValue(new Error('Firebase failed'))

    render(<Library />)

    expect(
      await screen.findByText('Could not load your books. Please try again.')
    ).toBeInTheDocument()
  })

  it('deletes a book after the person confirms', async () => {
    getBooks.mockResolvedValue(sampleBooks)
    deleteBook.mockResolvedValue()
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<Library />)
    await screen.findByText('Things Fall Apart')

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' })
    await userEvent.click(deleteButtons[0])

    expect(deleteBook).toHaveBeenCalledWith('user1', 'b1')
    await waitFor(() => {
      expect(screen.queryByText('Things Fall Apart')).not.toBeInTheDocument()
    })
  })

  it('does not delete a book when the person cancels', async () => {
    getBooks.mockResolvedValue(sampleBooks)
    vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(<Library />)
    await screen.findByText('Things Fall Apart')

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' })
    await userEvent.click(deleteButtons[0])

    expect(deleteBook).not.toHaveBeenCalled()
    expect(screen.getByText('Things Fall Apart')).toBeInTheDocument()
  })

  it('changes the status of a book', async () => {
    getBooks.mockResolvedValue(sampleBooks)
    updateBookStatus.mockResolvedValue()

    render(<Library />)
    await screen.findByText('Things Fall Apart')

    const statusMenus = screen.getAllByLabelText('Status')
    await userEvent.selectOptions(statusMenus[0], 'Finished')

    expect(updateBookStatus).toHaveBeenCalledWith('user1', 'b1', 'Finished')
  })
})