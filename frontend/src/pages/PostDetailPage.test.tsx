import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Post } from '../api/posts'
import { deletePost, getPost, updatePost } from '../api/posts'
import { PostDetailPage } from './PostDetailPage'

vi.mock('../api/posts', () => ({
  getPost: vi.fn(),
  updatePost: vi.fn(),
  deletePost: vi.fn(),
}))

const mockedGetPost = vi.mocked(getPost)
const mockedUpdatePost = vi.mocked(updatePost)
const mockedDeletePost = vi.mocked(deletePost)

const post: Post = {
  id: 1,
  title: 'Original title',
  content: 'Original content',
  author: 'coach',
  created_at: '2026-01-01T00:00:00Z',
}

function renderPage(postId = post.id) {
  return render(
    <MemoryRouter initialEntries={[`/posts/${postId}`]}>
      <Routes>
        <Route path="/" element={<p>Home page</p>} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('PostDetailPage edit flow', () => {
  it('shows loading while the post request is in flight', () => {
    mockedGetPost.mockImplementation(() => new Promise(() => {}))

    renderPage()

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows the fetch error message when loading the post fails', async () => {
    mockedGetPost.mockRejectedValueOnce(new Error('Post not found'))

    renderPage()

    expect(await screen.findByText('Post not found')).toBeInTheDocument()
  })

  it('enters inline edit mode and hides Delete after clicking Edit', async () => {
    mockedGetPost.mockResolvedValueOnce(post)

    renderPage()

    expect(await screen.findByRole('heading', { name: post.title })).toBeInTheDocument()
    expect(screen.getByText(post.content)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    expect(screen.getByDisplayValue(post.title)).toBeInTheDocument()
    expect(screen.getByDisplayValue(post.content)).toBeInTheDocument()
    expect(screen.getByText(`by ${post.author}`)).toBeInTheDocument()
    expect(screen.getByText(post.created_at)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
  })

  it('shows Delete in view mode and keeps delete behavior usable', async () => {
    mockedGetPost.mockResolvedValueOnce(post)
    mockedDeletePost.mockResolvedValueOnce()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    renderPage()

    expect(await screen.findByRole('heading', { name: post.title })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(confirmSpy).toHaveBeenCalledWith('Delete this post?')
    await waitFor(() => expect(mockedDeletePost).toHaveBeenCalledWith(post.id))
    expect(await screen.findByText('Home page')).toBeInTheDocument()

    confirmSpy.mockRestore()
  })

  it('exits edit mode on Cancel without calling updatePost', async () => {
    mockedGetPost.mockResolvedValueOnce(post)

    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: 'Edit' }))
    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'Unsaved title' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(mockedUpdatePost).not.toHaveBeenCalled()
    expect(await screen.findByRole('heading', { name: post.title })).toBeInTheDocument()
    expect(screen.getByText(post.content)).toBeInTheDocument()
  })

  it('saves successfully, exits edit mode, updates the page, and does not refetch', async () => {
    const updatedPost: Post = {
      ...post,
      title: 'Updated title',
      content: 'Updated content',
    }

    mockedGetPost.mockResolvedValueOnce(post)
    mockedUpdatePost.mockResolvedValueOnce(updatedPost)

    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: 'Edit' }))
    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: updatedPost.title },
    })
    fireEvent.change(screen.getByPlaceholderText('Content'), {
      target: { value: updatedPost.content },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(mockedUpdatePost).toHaveBeenCalledWith(post.id, {
        title: updatedPost.title,
        content: updatedPost.content,
      })
    })
    expect(await screen.findByRole('heading', { name: updatedPost.title })).toBeInTheDocument()
    expect(screen.getByText(updatedPost.content)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
    expect(mockedGetPost).toHaveBeenCalledTimes(1)
  })

  it('shows the save error and keeps the edited values visible when updatePost fails', async () => {
    mockedGetPost.mockResolvedValueOnce(post)
    mockedUpdatePost.mockRejectedValueOnce(new Error('nope'))

    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: 'Edit' }))
    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'Broken title' },
    })
    fireEvent.change(screen.getByPlaceholderText('Content'), {
      target: { value: 'Broken content' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Failed to update post.')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Broken title')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Broken content')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })
})
