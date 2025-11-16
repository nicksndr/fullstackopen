const _ = require('lodash')

const dummy = (blogs) => {
    return 1
  }

  const totalLikes = (blogs) => {
    let sumLikes = 0
    blogs.forEach(blog => {
        sumLikes += blog.likes
    });
    return sumLikes
  }

  const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null
    
    let mostLikes = blogs[0]
    blogs.forEach(blog => {
        if (blog.likes > mostLikes.likes) 
            mostLikes = blog
      })
    return mostLikes
  }

  const mostBlogs = (blogs) => {
    const counts = _.groupBy(blogs, 'author') // { 'Alice': 3, 'Bob': 2, ... }
    const authors = _.map(counts, (blogsArray, author) => ({
        author: author,
        blogs: blogsArray.length
      }))
    return _.maxBy(authors, 'blogs') || null
  }

  const mostLikes = (blogs) => {
    const counts = _.groupBy(blogs, 'author')
    // Step 2: Map over each author's blogs and sum likes
    const authors = _.map(counts, (blogsArray, author) => ({
        author: author,
        likes: _.sumBy(blogsArray, 'likes')
      }))
    return _.maxBy(authors, 'likes')
  }
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }