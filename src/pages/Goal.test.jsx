import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Goal from './Goal'
import { getGoal, saveGoal, deleteGoal } from '../services/goalService'
import { getBooks } from '../services/bookService'

vi.mock('../components/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'user1' } }),
}))

vi.mock('../services/goalService', () => ({
  getGoal: vi.fn(),
  saveGoal: vi.fn(),
  deleteGoal: vi.fn(),
}))

vi.mock('../services/bookService', () => ({
  getBooks: vi.fn(),
}))

const finishedBook = { id: 'b1', status: 'Finished' }
const readingBook = { id: 'b2', status: 'Reading' }
const anotherFinishedBook = { id: 'b3', status: 'Finished' }

const goalLabel = 'How many books do you want to read this year?'

function setup(goal, books) {
  getGoal.mockResolvedValue(goal)
  getBooks.mockResolvedValue(books)
  render(<Goal />)
}

describe('Goal page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows a message when there is no goal yet', async () => {
    setup(null, [])

    expect(
      await screen.findByText('No goal yet. Set one below.')
    ).toBeInTheDocument()
  })

  it('shows the progress towards the goal', async () => {
    setup({ target: 4, year: 2026 }, [finishedBook, readingBook])

    expect(
      await screen.findByText('You have finished 1 of 4 books in 2026.')
    ).toBeInTheDocument()
    expect(screen.getByText('25% done')).toBeInTheDocument()
  })

  it('never shows more than 100%', async () => {
    setup({ target: 1, year: 2026 }, [finishedBook, anotherFinishedBook])

    expect(await screen.findByText('100% done')).toBeInTheDocument()
  })

  it('shows an error when the goal cannot be loaded', async () => {
    getGoal.mockRejectedValue(new Error('Firebase failed'))
    getBooks.mockResolvedValue([])

    render(<Goal />)

    expect(
      await screen.findByText('Could not load your goal. Please try again.')
    ).toBeInTheDocument()
  })

  it('saves a new goal', async () => {
    saveGoal.mockResolvedValue()
    setup(null, [])
    await screen.findByText('No goal yet. Set one below.')

    await userEvent.type(screen.getByLabelText(goalLabel), '5')
    await userEvent.click(screen.getByRole('button', { name: 'Save goal' }))

    expect(saveGoal).toHaveBeenCalledWith('user1', 5)
    expect(await screen.findByText(/of 5 books/)).toBeInTheDocument()
  })

  it('shows an error when the goal box is empty', async () => {
    setup(null, [])
    await screen.findByText('No goal yet. Set one below.')

    await userEvent.click(screen.getByRole('button', { name: 'Save goal' }))

    expect(
      await screen.findByText('Enter a number of books, 1 or more.')
    ).toBeInTheDocument()
    expect(saveGoal).not.toHaveBeenCalled()
  })

  it('updates an existing goal', async () => {
    saveGoal.mockResolvedValue()
    setup({ target: 4, year: 2026 }, [])
    await screen.findByText(/of 4 books/)

    const box = screen.getByLabelText(goalLabel)
    await userEvent.clear(box)
    await userEvent.type(box, '10')
    await userEvent.click(screen.getByRole('button', { name: 'Update goal' }))

    expect(saveGoal).toHaveBeenCalledWith('user1', 10)
  })

  it('shows an error when the goal cannot be saved', async () => {
    saveGoal.mockRejectedValue(new Error('Firebase failed'))
    setup(null, [])
    await screen.findByText('No goal yet. Set one below.')

    await userEvent.type(screen.getByLabelText(goalLabel), '5')
    await userEvent.click(screen.getByRole('button', { name: 'Save goal' }))

    expect(
      await screen.findByText('Could not save your goal. Please try again.')
    ).toBeInTheDocument()
  })

  it('deletes the goal after the person confirms', async () => {
    deleteGoal.mockResolvedValue()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    setup({ target: 4, year: 2026 }, [])
    await screen.findByText(/of 4 books/)

    await userEvent.click(screen.getByRole('button', { name: 'Delete goal' }))

    expect(deleteGoal).toHaveBeenCalledWith('user1')
    expect(
      await screen.findByText('No goal yet. Set one below.')
    ).toBeInTheDocument()
  })

  it('does not delete the goal when the person cancels', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    setup({ target: 4, year: 2026 }, [])
    await screen.findByText(/of 4 books/)

    await userEvent.click(screen.getByRole('button', { name: 'Delete goal' }))

    expect(deleteGoal).not.toHaveBeenCalled()
    expect(screen.getByText(/of 4 books/)).toBeInTheDocument()
  })

  it('shows an error when the goal cannot be deleted', async () => {
    deleteGoal.mockRejectedValue(new Error('Firebase failed'))
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    setup({ target: 4, year: 2026 }, [])
    await screen.findByText(/of 4 books/)

    await userEvent.click(screen.getByRole('button', { name: 'Delete goal' }))

    expect(
      await screen.findByText('Could not delete your goal. Please try again.')
    ).toBeInTheDocument()
  })
})