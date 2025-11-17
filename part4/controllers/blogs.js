const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    
  const blogs = await Blog.find({}) // When using async/await syntax, Express will automatically call the error-handling middleware if an await statement throws an error or the awaited promise is rejected. 
  response.json(blogs)
})
  
  blogsRouter.get('/:id', async (request , response) => {
    const blog = await Blog.findById(request.params.id)

    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  })

  blogsRouter.delete('/:id', async(request, response, next) => {
    const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
    
    if (deletedBlog) {
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  })
  
  //update blog post with PUT request
  blogsRouter.put('/:id', async(request, response, next) => {
    const body = request.body
  
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    }
  
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true })

    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(404).end()
    }


      // Old version with promises

      // .then((updatedBlog) => {
      //   if (updatedBlog) {
      //     response.json(updatedBlog)
      //   } else {
      //     response.status(404).end()
      //   }
      // })
      // .catch((err) => {
      //   error('Error updating blog:', err)
      //   next(err)
      // })
  })
  
  blogsRouter.post('/', async(request, response) => {
    const body = request.body
  
    if (!body.title) {
      return response.status(400).json({ error: 'title is missing' })
    }

    if (!body.url) {
        return response.status(400).json({ error: 'url is missing' })
      }
  
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
    })
  
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  })

module.exports = blogsRouter