require('dotenv').config()
// const config = require('./utils/config')
// const logger = require('./utils/logger')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Blog = require('./blogs.js') 

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
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/blogs', (request, response) => {

  if (!body.title) {
    return response.status(400).json({ error: 'title is missing' })
  }

  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})