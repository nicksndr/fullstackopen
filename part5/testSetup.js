import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import Blog from './components/Blog'

afterEach(() => {
  cleanup()
})


describe('<Blog />', () => {
    beforeEach(() => {

        const blog = {
            id: '64b6b8f2c42f9b5ac1234567',   // any unique string
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
    
          const likeButton = async (blog) => {
    
            const newBlog = {
              url: blog.url,
              title: blog.title,
              author: blog.author,
              user: blog.user,
              likes: blog.likes + 1
            }
        
            blogService
              .update(blog.id, newBlog)
              .then(newBlog => {
                setBlogs(blogs.map(b => b.id !== newBlog.id ? b : newBlog))
              })
        
            return // Important: exit the function after update
          }
        
          const removeBlog = async (blog) => {
        
            if (!window.confirm(`Remove ${blog.title} by ${blog.author}`)) return
        
            blogService
              .remove(blog.id, user.token)
              .then(() => {
                setBlogs(blogs.filter(b => b.id !== blog.id))
              })
        
            return
          }

      render(
        render(<Blog key={blog.id} blog={blog} onClick={() => likeButton(blog)} remove={() => removeBlog(blog)} />)
  
      )
    })

    test('renders content', () => {
            
        const title = screen.getByText('Testing React components')
        const author = screen.getByText('Ada Lovelace')
        expect(title).toBeDefined()
        expect(author).toBeDefined()
    })

    test('at start url and likes not displayed', () => {
        const url = screen.getByText('https://example.com/testing-react')
        const likes = screen.getByText('5')
        expect(url).not.toBeVisible()
        expect(likes).not.toBeVisible()
      })
})