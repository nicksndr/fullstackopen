require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./models/user')
const Blog = require('./models/blog')
const config = require('./utils/config')
const { info, error } = require('./utils/logger')

const url = config.MONGODB_URI

if (!url) {
  error('Error: MONGODB_URI not found in .env file')
  process.exit(1)
}

mongoose.set('strictQuery', false)

const seedDatabase = async () => {
  try {
    info('connecting to', url)
    await mongoose.connect(url)
    info('connected to MongoDB')

    // Clear existing data
    info('clearing existing data...')
    await Blog.deleteMany({})
    await User.deleteMany({})
    info('cleared existing data')

    // Create users
    info('creating users...')
    const passwordHash1 = await bcrypt.hash('password123', 10)
    const passwordHash2 = await bcrypt.hash('password456', 10)
    const passwordHash3 = await bcrypt.hash('password789', 10)

    const users = [
      new User({
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        passwordHash: passwordHash1,
      }),
      new User({
        username: 'hellas',
        name: 'Arto Hellas',
        passwordHash: passwordHash2,
      }),
      new User({
        username: 'johndoe',
        name: 'John Doe',
        passwordHash: passwordHash3,
      }),
    ]

    const savedUsers = await User.insertMany(users)
    info(`created ${savedUsers.length} users`)

    // Create blogs and link them to users
    info('creating blogs...')
    const blogs = [
      new Blog({
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        user: savedUsers[0]._id,
      }),
      new Blog({
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        user: savedUsers[0]._id,
      }),
      new Blog({
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        user: savedUsers[1]._id,
      }),
      new Blog({
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        user: savedUsers[1]._id,
      }),
      new Blog({
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        user: savedUsers[2]._id,
      }),
      new Blog({
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        user: savedUsers[2]._id,
      }),
    ]

    const savedBlogs = await Blog.insertMany(blogs)
    info(`created ${savedBlogs.length} blogs`)

    // Update users' blogs arrays
    info('linking blogs to users...')
    savedUsers[0].blogs = [savedBlogs[0]._id, savedBlogs[1]._id]
    savedUsers[1].blogs = [savedBlogs[2]._id, savedBlogs[3]._id]
    savedUsers[2].blogs = [savedBlogs[4]._id, savedBlogs[5]._id]

    await Promise.all(savedUsers.map(user => user.save()))
    info('linked blogs to users')

    info('\nDatabase seeded successfully!')
    info(`Created ${savedUsers.length} users and ${savedBlogs.length} blogs`)
    
    await mongoose.connection.close()
    info('connection closed')
    process.exit(0)
  } catch (err) {
    error('error seeding database:', err.message)
    await mongoose.connection.close()
    process.exit(1)
  }
}

seedDatabase()

