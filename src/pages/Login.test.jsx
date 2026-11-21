import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { vi } from 'vitest'
import Login from './Login'

const { mockLogin, mockRegister, mockGoogle } = vi.hoisted(() => ({
  mockLogin: vi.fn(),
  mockRegister: vi.fn(),
  mockGoogle: vi.fn(),
}))

vi.mock('../components/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    register: mockRegister,
    loginWithGoogle: mockGoogle,
  }),
}))

function renderLogin() {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/library" element={<p>Library page</p>} />
      </Routes>
    </MemoryRouter>
  )
}

async function typeEmailAndPassword(email, password) {
  await userEvent.type(screen.getByLabelText('Email'), email)
  await userEvent.type(screen.getByLabelText('Password'), password)
}

describe('Login page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows the email and password fields', () => {
    renderLogin()

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('shows the name field after clicking Register', async () => {
    renderLogin()

    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('tab', { name: 'Register' }))

    expect(screen.getByLabelText('Name')).toBeInTheDocument()
  })

  it('logs in and goes to the library', async () => {
    mockLogin.mockResolvedValue()
    renderLogin()

    await typeEmailAndPassword('test@example.com', 'secret123')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'secret123')
    expect(await screen.findByText('Library page')).toBeInTheDocument()
  })

  it('shows an error for a wrong password', async () => {
    mockLogin.mockRejectedValue({ code: 'auth/invalid-credential' })
    renderLogin()

    await typeEmailAndPassword('test@example.com', 'wrongpass')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(
      await screen.findByText('Invalid email or password.')
    ).toBeInTheDocument()
  })

  it('registers a new person and goes to the library', async () => {
    mockRegister.mockResolvedValue()
    renderLogin()

    await userEvent.click(screen.getByRole('tab', { name: 'Register' }))
    await userEvent.type(screen.getByLabelText('Name'), 'Ada Lovelace')
    await typeEmailAndPassword('ada@example.com', 'secret123')
    await userEvent.click(
      screen.getByRole('button', { name: 'Create account' })
    )

    expect(mockRegister).toHaveBeenCalledWith(
      'Ada Lovelace',
      'ada@example.com',
      'secret123'
    )
    expect(await screen.findByText('Library page')).toBeInTheDocument()
  })

  it('asks for a name when registering without one', async () => {
    renderLogin()

    await userEvent.click(screen.getByRole('tab', { name: 'Register' }))
    await typeEmailAndPassword('ada@example.com', 'secret123')
    await userEvent.click(
      screen.getByRole('button', { name: 'Create account' })
    )

    expect(await screen.findByText('Enter your name.')).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('shows an error when the email is already used', async () => {
    mockRegister.mockRejectedValue({ code: 'auth/email-already-in-use' })
    renderLogin()

    await userEvent.click(screen.getByRole('tab', { name: 'Register' }))
    await userEvent.type(screen.getByLabelText('Name'), 'Ada Lovelace')
    await typeEmailAndPassword('ada@example.com', 'secret123')
    await userEvent.click(
      screen.getByRole('button', { name: 'Create account' })
    )

    expect(
      await screen.findByText('An account with this email already exists.')
    ).toBeInTheDocument()
  })

  it('shows an error when the password is too weak', async () => {
    mockRegister.mockRejectedValue({ code: 'auth/weak-password' })
    renderLogin()

    await userEvent.click(screen.getByRole('tab', { name: 'Register' }))
    await userEvent.type(screen.getByLabelText('Name'), 'Ada Lovelace')
    await typeEmailAndPassword('ada@example.com', 'secret123')
    await userEvent.click(
      screen.getByRole('button', { name: 'Create account' })
    )

    expect(
      await screen.findByText('Password must be at least 6 characters.')
    ).toBeInTheDocument()
  })

  it('shows an error for an invalid email', async () => {
    mockLogin.mockRejectedValue({ code: 'auth/invalid-email' })
    renderLogin()

    await typeEmailAndPassword('test@example.com', 'secret123')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(
      await screen.findByText('Enter a valid email address.')
    ).toBeInTheDocument()
  })

  it('shows a general error for an unknown problem', async () => {
    mockLogin.mockRejectedValue({ code: 'auth/something-else' })
    renderLogin()

    await typeEmailAndPassword('test@example.com', 'secret123')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(
      await screen.findByText('Something went wrong. Please try again.')
    ).toBeInTheDocument()
  })

  it('logs in with Google and goes to the library', async () => {
    mockGoogle.mockResolvedValue()
    renderLogin()

    await userEvent.click(
      screen.getByRole('button', { name: 'Continue with Google' })
    )

    expect(mockGoogle).toHaveBeenCalled()
    expect(await screen.findByText('Library page')).toBeInTheDocument()
  })

  it('shows a message when the Google window is closed', async () => {
    mockGoogle.mockRejectedValue({ code: 'auth/popup-closed-by-user' })
    renderLogin()

    await userEvent.click(
      screen.getByRole('button', { name: 'Continue with Google' })
    )

    expect(
      await screen.findByText('Google sign-in was cancelled.')
    ).toBeInTheDocument()
  })

  it('clears the error when switching to the other tab', async () => {
    mockLogin.mockRejectedValue({ code: 'auth/invalid-credential' })
    renderLogin()

    await typeEmailAndPassword('test@example.com', 'wrongpass')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))
    await screen.findByText('Invalid email or password.')

    await userEvent.click(screen.getByRole('tab', { name: 'Register' }))

    expect(
      screen.queryByText('Invalid email or password.')
    ).not.toBeInTheDocument()
  })
})