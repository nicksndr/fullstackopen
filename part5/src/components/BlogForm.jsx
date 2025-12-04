const BlogForm = ({
  onSubmit,
  title,
  author,
  url,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange
}) => {
  return (
    <div>
      <h2>Create new blog</h2>

      <form onSubmit={onSubmit}>
        <div>
          Title:{' '}
          <input
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          Author:{' '}
          <input
            value={author}
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          Url:{' '}
          <input
            value={url}
            onChange={handleUrlChange}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default BlogForm
