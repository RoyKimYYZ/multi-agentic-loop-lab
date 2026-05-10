import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Post } from '../api/posts'
import { listPosts } from '../api/posts'
import { HomePage } from './HomePage'

vi.mock('../api/posts', () => ({
  listPosts: vi.fn(),
  createPost: vi.fn(),
  deletePost: vi.fn(),
}))

const mockedListPosts = vi.mocked(listPosts)

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
    mockedListPosts.mockResolvedValueOnce(posts)

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: posts[0].title })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()
  })
})
