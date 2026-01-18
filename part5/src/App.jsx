import { useState, useEffect } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import BlogList from "./components/BlogList";
import UserInformation from "./components/UserInformation";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "./index.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  // const [newBlog, setNewBlog] = useState('')
  // const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedInUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      // blogService.setToken(user.token) //not yet needed as we don't use the token for auth yet??
    }
  }, []);

  const padding = {
    padding: 5,
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      setUsername("");
      setPassword("");
      setErrorMessage(null);

      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
    } catch {
      setErrorMessage("wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user || !user.token) {
      setErrorMessage("No authentication token found. Please log in again.");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return;
    }

    const blogObject = {
      title: title,
      author: author,
      url: url,
    };

    try {
      const newBlog = await blogService.create(blogObject, user.token);
      setBlogs(blogs.concat(newBlog));
      setTitle("");
      setAuthor("");
      setUrl("");
      setSuccessMessage(`a new blog '${title}' by '${author}' added`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error adding blog";
      setErrorMessage(errorMessage);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const likeButton = async (blog) => {
    const newBlog = {
      url: blog.url,
      title: blog.title,
      author: blog.author,
      user: blog.user,
      likes: blog.likes + 1,
    };

    blogService.update(blog.id, newBlog).then((newBlog) => {
      setBlogs(blogs.map((b) => (b.id !== newBlog.id ? b : newBlog)));
    });

    return; // Important: exit the function after update
  };

  const removeBlog = async (blog) => {
    if (!window.confirm(`Remove ${blog.title} by ${blog.author}`)) return;

    blogService.remove(blog.id, user.token).then(() => {
      setBlogs(blogs.filter((b) => b.id !== blog.id));
    });

    return;
  };

  void removeBlog;

  const handleLogout = () => {
    window.localStorage.removeItem("loggedInUser");
    setUser(null);
  };

  const UserBloglist = ({ blogs }) => {
    //useParams to get ID out of URL
    const { id } = useParams();
    // blog.user check if blog has user property
    const userBlogs = blogs.filter((blog) => blog.user && blog.user.id === id);
    const userName =
      userBlogs.length > 0 ? userBlogs[0].user.name : "Unknown User";

    return (
      <div>
        <h2>{userName}</h2>
        <h3>Added blogs</h3>
        <ul>
          {userBlogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      </div>
    );
  };

  const BlogView = ({ blogs }) => {
    const { id } = useParams();
    const blog = blogs.find((b) => b.id === id);

    if (!blog) {
      return <div>Blog not found</div>;
    }

    return (
      <div>
        <h2>{blog.title}</h2>
        <div>
          <a href={blog.url}>{blog.url}</a>
        </div>
        <div>
          {'likes '}
          {blog.likes} <button onClick={() => likeButton(blog)}>like</button>
        </div>
        <div>added by {blog.author}</div>
        <h3>comments</h3>
        {blog.comments && blog.comments.length > 0 ? (
          <ul>
            {blog.comments.map((comment) => (
              <li key={comment.id}>{comment.text}</li>
            ))}
          </ul>
        ) : (
          <div>No comments for this blog post yet</div>
        )}
      </div>
    );
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
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
    );
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/">
          blogs
        </Link>
        <Link style={padding} to="/users">
          users
        </Link>
        <p>
          {user.name} logged in <button onClick={handleLogout}>logout</button>
        </p>
      </div>

      <Routes>
        <Route path="/users" element={<UserInformation blogs={blogs} />} />
        <Route path="/users/:id" element={<UserBloglist blogs={blogs} />} />
        <Route path="/blogs/:id" element={<BlogView blogs={blogs} />} />
        <Route
          path="/"
          element={
            <BlogList
              blogs={blogs}
              errorMessage={errorMessage}
              successMessage={successMessage}
              title={title}
              author={author}
              url={url}
              handleSubmit={handleSubmit}
              handleTitleChange={({ target }) => setTitle(target.value)}
              handleAuthorChange={({ target }) => setAuthor(target.value)}
              handleUrlChange={({ target }) => setUrl(target.value)}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
