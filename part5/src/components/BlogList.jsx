import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Box,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import Togglable from "./Togglable";
import BlogForm from "./BlogForm";

const BlogList = ({
  blogs,
  errorMessage,
  successMessage,
  title,
  author,
  url,
  handleSubmit,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange
  // likeButton,
  // removeBlog,
}) => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Blogs
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ marginBottom: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Togglable buttonLabel="create new blog">
        {/* create button comes from the BlogForm submit button, the cancel button comes from the togglabel component */}
        <BlogForm
          onSubmit={handleSubmit}
          title={title}
          author={author}
          url={url}
          handleTitleChange={handleTitleChange}
          handleAuthorChange={handleAuthorChange}
          handleUrlChange={handleUrlChange}
        />
      </Togglable>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Title</strong>
              </TableCell>
              <TableCell>
                <strong>Author</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Likes</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs
              .sort((a, b) => b.likes - a.likes)
              .map((blog) => (
                <TableRow key={blog.id} hover>
                  <TableCell>
                    <Link
                      to={`/blogs/${blog.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {blog.title}
                    </Link>
                  </TableCell>
                  <TableCell>{blog.author}</TableCell>
                  <TableCell align="right">{blog.likes}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BlogList;
