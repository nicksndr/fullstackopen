const { test, before, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./helper')
const Blog = require('../models/blog')
const config = require('../utils/config')

const api = supertest(app)

before(async () => {
  await mongoose.connect(config.MONGODB_URI)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

after(async () => {
  await mongoose.connection.close()
})


describe('testing the blogs', () => {

  test('should return correct amount of blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('should return blogs with right unique identifier property', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach((blog) => {
      assert.ok(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'adding blogs is not that difficult',
      author: 'Andy Author',
      url: 'www.blogs.org',
      likes: 3,
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.title)
  
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    assert(contents.includes('adding blogs is not that difficult'))
  })

  test('missing likes property', async () => {
    const newBlog = {
      title: 'adding blogs is not that difficult',
      author: 'Andy Author',
      url: 'www.blogs.org',
    }
  
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const newBlogWithoutLikes = response.body
  
    assert.strictEqual(newBlogWithoutLikes.likes, 0)
  })

  test('missing title or url, results in 400 error', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const missingTitle = {
      author: 'Andy Author',
      url: 'https://blog.org',
      likes: 3,
    }
  
    const missingUrl = {
      title: 'adding blogs is not that difficult',
      author: 'Andy Author',
      likes: 3,
    }
  
    await api
      .post('/api/blogs')
      .send(missingTitle)
      .expect(400)
  
    await api
      .post('/api/blogs')
      .send(missingUrl)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })

  test('deleting a blog post', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
  
    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map(b => b.title)
    assert(!titles.includes(blogToDelete.title))
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  })

})