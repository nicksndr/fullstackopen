import { useState, useEffect } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  TextField,
  Box,
  Alert,
  Stack,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";
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
  const [comment, setComment] = useState("");

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

  const handleCommentSubmit = async (id) => {

    const commentObject = {
      text: comment
    };

    try {
      await blogService.createComment(id, commentObject);
      blogService.getAll().then((blogs) => setBlogs(blogs));
      setComment("");
      setSuccessMessage(`new comment added`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error adding comment";
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
      <Container sx={{ paddingTop: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {userName}
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom sx={{ marginTop: 2 }}>
          Added blogs
        </Typography>
        {userBlogs.length > 0 ? (
          <List>
            {userBlogs.map((blog) => (
              <ListItem key={blog.id} divider>
                <ListItemText primary={blog.title} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Alert severity="info">No blogs added yet</Alert>
        )}
      </Container>
    );
  };

  const BlogView = ({ blogs, comment, setComment, handleCommentSubmit, likeButton }) => {
    const { id } = useParams();
    const blog = blogs.find((b) => b.id === id);

    if (!blog) {
      return (
        <Container>
          <Alert severity="error">Blog not found</Alert>
        </Container>
      );
    }

    return (
      <Container sx={{ paddingTop: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {blog.title}
        </Typography>
        
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body1" gutterBottom>
            <strong>URL:</strong>{" "}
            <a href={blog.url} target="_blank" rel="noopener noreferrer">
              {blog.url}
            </a>
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginTop: 1 }}>
            <Chip label={`${blog.likes} likes`} color="primary" />
            <Button
              variant="outlined"
              size="small"
              onClick={() => likeButton(blog)}
            >
              Like
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
            Added by {blog.author}
          </Typography>
        </Box>

        <Typography variant="h5" component="h2" gutterBottom sx={{ marginTop: 3 }}>
          Comments
        </Typography>

        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleCommentSubmit(id); }} sx={{ marginBottom: 3 }}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Add a comment"
              value={comment}
              onChange={({ target }) => setComment(target.value)}
              fullWidth
              size="small"
            />
            <Button type="submit" variant="contained" sx={{ minWidth: 120 }}>
              Add Comment
            </Button>
          </Stack>
        </Box>

        {blog.comments && blog.comments.length > 0 ? (
          <List>
            {blog.comments.map((comment) => (
              <ListItem key={comment.id} divider>
                <ListItemText primary={comment.text} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Alert severity="info">No comments for this blog post yet</Alert>
        )}
      </Container>
    );
  };

  if (user === null) {
    return (
      <Container maxWidth="sm" sx={{ marginTop: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Log in to application
        </Typography>
        {errorMessage && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <Box component="form" onSubmit={handleLogin}>
          <Stack spacing={2}>
            <TextField
              label="Username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" fullWidth size="large">
              Login
            </Button>
          </Stack>
        </Box>
      </Container>
    );
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Blogs
          </Button>
          <Button color="inherit" component={Link} to="/users">
            Users
          </Button>
          <Chip
            label={user.name}
            color="secondary"
            sx={{ marginX: 2 }}
          />
          <IconButton color="inherit" onClick={handleLogout} aria-label="logout">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/users" element={<UserInformation blogs={blogs} />} />
        <Route path="/users/:id" element={<UserBloglist blogs={blogs} />} />
        <Route
          path="/blogs/:id"
          element={
            <BlogView
              blogs={blogs}
              comment={comment}
              setComment={setComment}
              handleCommentSubmit={handleCommentSubmit}
              likeButton={likeButton}
            />
          }
        />
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
    </Box>
  );
};

export default App;
