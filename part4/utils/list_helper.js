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
  
  module.exports = {
    dummy,
    totalLikes
  }