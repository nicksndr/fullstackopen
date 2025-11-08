require('dotenv').config()
const mongoose = require('mongoose')
const Blog = require('./blogs.js')  //import the model

const url = process.env.MONGODB_URI

if (!url) {
  console.log('Error: MONGODB_URI not found in .env file')
  process.exit(1)
}

mongoose.set('strictQuery', false)

console.log('connecting to', url)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
    
    const title = process.argv[2]
    const author = process.argv[3]
    // Renamed the blog URL variable from url to blogUrl to avoid shadowing
    const blogUrl = process.argv[4]
    const likes = process.argv[5] || 0

    if (process.argv.length === 2) {
      // If no arguments given, list all blogs
      Blog.find({}).then(result => {
        console.log('\nBlogs in database:')
        if (result.length === 0) {
          console.log('No blogs found')
        } else {
          result.forEach(blog => {
            console.log(`${blog.title} by ${blog.author} - ${blog.url} (${blog.likes} likes)`)
          })
        }
        mongoose.connection.close()
      }).catch(error => {
        console.log('Error fetching blogs:', error.message)
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
        console.log(`\nAdded blog: "${title}" by ${author} to database`)
        mongoose.connection.close()
      }).catch(error => {
        console.log('Error saving blog:', error.message)
        mongoose.connection.close()
        process.exit(1)
      })
    } else {
    // invalid arguments: it prints usage instruction
      console.log('\nUsage:')
      console.log('  node mongo.js                    - List all blogs')
      console.log('  node mongo.js <title> <author> <url> [likes] - Add a new blog')
      mongoose.connection.close()
    }
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
    mongoose.connection.close()
  })