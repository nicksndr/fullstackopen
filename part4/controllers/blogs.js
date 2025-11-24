const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    
  // When using async/await syntax, Express will automatically call the error-handling middleware if an await statement throws an error or the awaited promise is rejected. 
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  
  response.json(blogs)
})
  
  blogsRouter.get('/:id', async (request , response) => {
    const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })

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

    if (!request.token) {
      return response.status(401).json({ error: 'token missing' })
    }

    const decodedToken = await jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
  
    if (!body.title) {
      return response.status(400).json({ error: 'title is missing' })
    }

    if (!body.url) {
        return response.status(400).json({ error: 'url is missing' })
      }
  
    // Find the user from the decoded token
    const user = await User.findById(decodedToken.id)
    
    if (!user) {
      return response.status(401).json({ error: 'user not found' })
    }
  
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id,
    })
  
    const savedBlog = await blog.save()
    
    // Add the blog to the user's blogs array
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    
    // Populate the user information before sending response
    await savedBlog.populate('user', { username: 1, name: 1 })
    
    response.status(201).json(savedBlog)
  })

module.exports = blogsRouter