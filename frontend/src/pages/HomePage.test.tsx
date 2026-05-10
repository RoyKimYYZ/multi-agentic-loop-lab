import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Post } from '../api/posts'
import { HomePage } from './HomePage'

const posts: Post[] = [
  {
    id: 1,
    title: 'First post',
    content: 'First content',
    author: 'coach',
    created_at: '2026-01-01T00:00:00Z',
  },
]

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.restoreAllMocks()
})

describe('HomePage', () => {
  it('does not show an Edit button in the post list', async () => {
    render(
      <MemoryRouter>
        <HomePage posts={posts} onDelete={vi.fn()} />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: posts[0].title })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()
  })
})

