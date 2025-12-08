import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const sampleBlog = {
  id: '64b6b8f2c42f9b5ac1234567',
  title: 'Testing React components',
  author: 'Ada Lovelace',
  url: 'https://example.com/testing-react',
  likes: 5,
  user: {
    id: '507f1f77bcf86cd799439011',
    name: 'Test User',
    username: 'tester'
  }
}

test('renders title and author but hides url and likes by default', () => {
  render(
    <Blog
      blog={sampleBlog}
      onClick={() => {}}
      remove={() => {}}
    />
  )

  const titleElements = screen.getAllByText(sampleBlog.title, { exact: false })
  const authorElements = screen.getAllByText(sampleBlog.author, { exact: false })

  const url = screen.getByText(sampleBlog.url, { exact: false })
  const likes = screen.getByText(`likes ${sampleBlog.likes}`, { exact: false })

  expect(titleElements[0]).toBeVisible()
  expect(authorElements[0]).toBeVisible()

  expect(url).not.toBeVisible()
  expect(likes).not.toBeVisible()

})

test('after clicking the button, url and like is visible', async () => {
  render(
    <Blog
      blog={sampleBlog}
      onClick={() => {}}
      remove={() => {}}
    />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const urlElements = screen.getAllByText(sampleBlog.url, { exact: false })
  const likesElements = screen.getAllByText(`likes ${sampleBlog.likes}`, { exact: false })

  expect(urlElements[0]).toBeVisible()
  expect(likesElements[0]).toBeVisible()
})

test('after clicking the button, url and like is visible', async () => {

  const mockHandler = vi.fn()

  render(
    <Blog
      blog={sampleBlog}
      onClick={mockHandler}
      remove={() => {}}
    />
  )


  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})