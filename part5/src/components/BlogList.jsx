import Blog from "./Blog";
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
  handleUrlChange,
  likeButton,
  removeBlog
}) => {
  return (
    <div>
      <h2>blogs</h2>
      {errorMessage && <div className={"error"}>{errorMessage}</div>}
      {/* works like condition && doSomething(), successMesssage set to null again after the time out */}
      {successMessage && <div className={"success"}>{successMessage}</div>}

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

      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            onClick={() => likeButton(blog)}
            remove={() => removeBlog(blog)}
          />
        ))}
    </div>
  );
};

export default BlogList;
