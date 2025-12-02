import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  // const [newBlog, setNewBlog] = useState('')
  // const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      // blogService.setToken(user.token) //not yet needed as we don't use the token for auth yet??
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      setUsername('')
      setPassword('')
      setErrorMessage(null)

      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!user || !user.token) {
      setErrorMessage('No authentication token found. Please log in again.')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }

    const blogObject = {
      title: title,
      author: author,
      url: url
    }

    try {
      const newBlog = await blogService.create(blogObject, user.token)
      setBlogs(blogs.concat(newBlog))
      setTitle('');
      setAuthor('');
      setUrl('');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error adding blog'
      setErrorMessage(errorMessage)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      <button onClick={() => {
        window.localStorage.removeItem('loggedInUser')
        setUser(null)
      }}>logout</button>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}

      <form onSubmit={handleSubmit}>
        <div>
          Title: <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          Author: <input value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div>
          Url: <input value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <div>
          <button type="submit">Create</button>
        </div>
      </form>
    </div>
  )
}

export default App