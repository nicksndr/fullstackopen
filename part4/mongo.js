const mongoose = require('mongoose')
const Blog = require('./blog.js')  //import the model

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const title = process.argv[3]
const author = process.argv[4]
const url = process.argv[5]
const likes = process.argv[6]

// added name blogApp as databse name
const mongoUrl = `mongodb+srv://nicklas-user:${password}@fullstackopen.ne6xdzf.mongodb.net/blogApp?retryWrites=true&w=majority&appName=fullstackopen`
mongoose.set('strictQuery',false)

mongoose.connect(mongoUrl)

if (process.argv.length === 3) {
  // If only password is given, list all blogs
  Blog.find({}).then(result => {
    console.log('Blog:')
    result.forEach(blog => {
      console.log(`${blog.title} ${blog.author}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 7) {
// If password + title + author + url + likes given, add a new blog
  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
  })

  blog.save().then(() => {
    console.log(`added ${title} ${author} to blog`)
    mongoose.connection.close()
  })
} else {
  console.log('Usage: node mongo.js <password> [title author url likes]')
  mongoose.connection.close()
}