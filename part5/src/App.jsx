import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  // const [newBlog, setNewBlog] = useState('')
  // const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
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
      setSuccessMessage(`a new blog '${title}' by '${author}' added`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error adding blog'
      setErrorMessage(errorMessage)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
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
      setBlogs(blogs.map(b => b.id !== newBlog.id ? b : newBlog));
    })

    return; // Important: exit the function after update
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
      {errorMessage && <div className={"error"}>{errorMessage}</div>}      {/* works like condition && doSomething(), successMesssage set to null again after the time out */}
      {successMessage && <div className={"success"}>{successMessage}</div>}
      <p>{user.name} logged in</p>
      <button onClick={() => {
        window.localStorage.removeItem('loggedInUser')
        setUser(null)
      }}>logout</button>

    <Togglable buttonLabel="create new blog">
      {/* crete button comes from the BlogForm submit button, the cancel button comes from the togglabel component */}
      <BlogForm
        onSubmit={handleSubmit}
        title={title}
        author={author}
        url={url}
        handleTitleChange={({ target }) => setTitle(target.value)}
        handleAuthorChange={({ target }) => setAuthor(target.value)}
        handleUrlChange={({ target }) => setUrl(target.value)}
      />
    </Togglable>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} onClick={() => likeButton(blog)} />
      )}
    </div>
  )
}

export default App
