require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const Blog = require('./blogs.js')
const { info, error } = require('./utils/logger')

const url = process.env.MONGODB_URI

if (!url) {
  info('Error: MONGODB_URI not found in .env file')
  process.exit(1)
}

mongoose.set('strictQuery', false)

info('connecting to', url)
mongoose.connect(url)
  .then(() => {
    info('connected to MongoDB')
  })
  .catch((err) => {
    error('error connecting to MongoDB:', err.message)
  })

app.use(express.json()) 
app.use(express.static('dist')) // serve static files from the dist directory

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

app.get('/api/blogs/:id', (request , response) => {
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

app.post('/api/blogs', (request, response) => {
  const body = request.body

  if (!body.title) {
    return response.status(400).json({ error: 'title is missing' })
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

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  info(`Server running on port ${PORT}`)
})