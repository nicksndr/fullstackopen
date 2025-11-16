const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { error } = require('../utils/logger')

blogsRouter.get('/', (request, response) => {
    Blog.find({}).then((blogs) => {
      response.json(blogs)
    })
  })
  
  blogsRouter.get('/:id', (request , response) => {
    Blog.findById(request.params.id)
      .then(blog => {
        if (blog) {
          response.json(blog)
        } else {
          response.status(404).end()
        }
      })
      .catch(err => {
        error('Error finding blog:', err)
        response.status(400).send({ error: 'malformatted id' })
      })
  })

  blogsRouter.delete('/:id', (request, response, next) => {
    Blog.findByIdAndDelete(request.params.id)
      .then(() => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })
  
  blogsRouter.post('/', (request, response) => {
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
  
    blog.save()
      .then((result) => {
        response.status(201).json(result)
      })
      .catch((err) => {
        error('Error saving blog:', err)
        response.status(500).json({ error: 'Failed to save blog' })
      })
  })

module.exports = blogsRouter