require('dotenv').config()
const mongoose = require('mongoose')
const Blog = require('./models/blog.js')  //import the model
const { info, error } = require('./utils/logger')
const config = require('./utils/config')

const url = config.MONGODB_URI

if (!url) {
  info('Error: MONGODB_URI not found in .env file')
  process.exit(1)
}

mongoose.set('strictQuery', false)

console.log('connecting to', url)
mongoose.connect(url)
  .then(() => {
    info('connected to MongoDB')
    
    const title = process.argv[2]
    const author = process.argv[3]
    // Renamed the blog URL variable from url to blogUrl to avoid shadowing
    const blogUrl = process.argv[4]
    const likes = process.argv[5] || 0

    if (process.argv.length === 2) {
      // If no arguments given, list all blogs
      Blog.find({}).then(result => {
        info('\nBlogs in database:')
        if (result.length === 0) {
            info('No blogs found')
        } else {
          result.forEach(blog => {
            info(`${blog.title} by ${blog.author} - ${blog.url} (${blog.likes} likes)`)
          })
        }
        mongoose.connection.close()
      }).catch(err => {
        error('Error fetching blogs:', err.message)
        mongoose.connection.close()
        process.exit(1)
      })
    } else if (process.argv.length >= 4) {
      // If title + author + url (+ likes) given, add a new blog
      const blog = new Blog({
        title: title,
        author: author,
        url: blogUrl,
        likes: Number(likes),
      })

      blog.save().then(() => {
        info(`\nAdded blog: "${title}" by ${author} to database`)
        mongoose.connection.close()
      }).catch(err => {
        error('Error saving blog:', err.message)
        mongoose.connection.close()
        process.exit(1)
      })
    } else {
    // invalid arguments: it prints usage instruction
      info('\nUsage:')
      info('  node mongo.js                    - List all blogs')
      info('  node mongo.js <title> <author> <url> [likes] - Add a new blog')
      mongoose.connection.close()
    }
  })
  .catch(err => {
    error('error connecting to MongoDB:', err.message)
    mongoose.connection.close()
  })