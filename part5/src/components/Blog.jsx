import { useState } from 'react'

const Blog = ({ blog, onClick, remove }) => {

  const [contentVisible, setContentVisible] = useState(false)

  const hideWhenVisible = { display: contentVisible ? 'none' : '' }
  const showWhenVisible = { display: contentVisible ? '' : 'none' }
  
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title}
        <button onClick={() => setContentVisible(true)}>view</button>
      </div>

      <div style={showWhenVisible}>
        {blog.title}
        <button onClick={() => setContentVisible(false)}>hide</button><br/>
        {blog.url}<br/>
        {"likes "}{blog.likes} <button onClick={onClick}>like</button><br/>
        {blog.author}<br/>
        <button onClick={remove}>remove</button>
      </div>
    </div>  
)}

export default Blog