const BlogForm = ({
  onSubmit,
  title,
  author,
  url,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
}) => {
  return (
    <div>
      <h2>Create new blog</h2>

      <form onSubmit={onSubmit}>
        <div>
          <label>
            Title: <input value={title} onChange={handleTitleChange} />
          </label>
        </div>
        <div>
          <label>
            Author: <input value={author} onChange={handleAuthorChange} />
          </label>
        </div>
        <div>
          <label>
            Url: <input value={url} onChange={handleUrlChange} />
          </label>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default BlogForm
