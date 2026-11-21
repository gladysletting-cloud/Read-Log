import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { vi } from 'vitest'
import ProtectedRoute from './ProtectedRoute'
import { useAuth } from './AuthContext'

vi.mock('./AuthContext', () => ({
  useAuth: vi.fn(),
}))

function renderApp() {
  render(
    <MemoryRouter initialEntries={['/library']}>
      <Routes>
        <Route path="/login" element={<p>Login page</p>} />
        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <p>Secret page</p>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  it('shows Loading while Firebase checks who is logged in', () => {
    useAuth.mockReturnValue({ user: null, loading: true })

    renderApp()

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('sends people who are not logged in to the login page', () => {
    useAuth.mockReturnValue({ user: null, loading: false })

    renderApp()

    expect(screen.getByText('Login page')).toBeInTheDocument()
    expect(screen.queryByText('Secret page')).not.toBeInTheDocument()
  })

  it('shows the page and the navigation bar when logged in', () => {
    useAuth.mockReturnValue({
      user: { email: 'test@example.com' },
      loading: false,
      logout: vi.fn(),
    })

    renderApp()

    expect(screen.getByText('Secret page')).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})