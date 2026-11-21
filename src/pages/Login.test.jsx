import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Login from './Login'

vi.mock('../components/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn(),
    register: vi.fn(),
    loginWithGoogle: vi.fn(),
  }),
}))

describe('Login page', () => {
  it('shows the email and password fields', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('shows the name field after clicking Register', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('tab', { name: 'Register' }))

    expect(screen.getByLabelText('Name')).toBeInTheDocument()
  })
})