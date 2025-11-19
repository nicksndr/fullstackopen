const { test, before, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./helper')
const User = require('../models/user')
const config = require('../utils/config')

const api = supertest(app)

before(async () => {
  await mongoose.connect(config.MONGODB_URI)
})

beforeEach(async () => {
  await User.deleteMany({})
  
  // Create initial users in the database
  const passwordHash1 = await bcrypt.hash('password123', 10)
  const passwordHash2 = await bcrypt.hash('password456', 10)
  
  const initialUsers = [
    {
      username: 'testuser1',
      name: 'Test User 1',
      passwordHash: passwordHash1,
    },
    {
      username: 'testuser2',
      name: 'Test User 2',
      passwordHash: passwordHash2,
    },
  ]
  
  await User.insertMany(initialUsers)
})

after(async () => {
  await mongoose.connection.close()
})

describe('user validation', () => {
  test('no username is given, check if the number of users is the same', async () => {
    const usersAtStart = await helper.usersInDb()
    
    const newUser = {
      name: 'Test User',
      password: 'password123',
    }
    
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    assert(response.body.error.includes('username'))
    
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('username with less than 3 characters is given', async () => {
    const usersAtStart = await helper.usersInDb()
    
    const newUser = {
      username: 'ab',
      name: 'Test User',
      password: 'password123',
    }
    
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    assert(response.body.error.includes('username'))
    assert(response.body.error.includes('3 characters'))
    
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('password with less than 3 characters is given', async () => {
    const usersAtStart = await helper.usersInDb()
    
    const newUser = {
      username: 'newuser',
      name: 'Test User',
      password: 'ab',
    }
    
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    assert(response.body.error.includes('password'))
    assert(response.body.error.includes('3 characters'))
    
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('username is not unique', async () => {
    const usersAtStart = await helper.usersInDb()
    
    const newUser = {
      username: 'testuser1', // This username already exists
      name: 'Test User',
      password: 'password123',
    }
    
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    assert(response.body.error.includes('unique'))
    
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('missing password returns error', async () => {
    const usersAtStart = await helper.usersInDb()
    
    const newUser = {
      username: 'newuser',
      name: 'Test User',
    }
    
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    assert(response.body.error.includes('password'))
    
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})
