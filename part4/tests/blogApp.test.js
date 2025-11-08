const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('totalLikes', () => {
    const listWithOneBlog = [
        {
          _id: '5a422aa71b54a676234d17f8',
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
          likes: 5,
          __v: 0
        }
      ]
    test('total sum of likes in all of the blog posts', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })
  })

  describe('favoriteBlog', () => {
    const listWithBlogs = [
        {
            _id: '1',
            title: 'Title 1',
            author: 'Author 1',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 4,
            __v: 0
        },
        {
            _id: '2',
            title: 'Title 2',
            author: 'Author 2',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 3,
            __v: 0
        },
        {
            _id: '3',
            title: 'Title 3',
            author: 'Author 3',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 6,
            __v: 0
        }
        
      ]
    test('blog with the most likes', () => {
        const result = listHelper.favoriteBlog(listWithBlogs)
        assert.deepStrictEqual(
            result,
            {
                _id: '3',
                title: 'Title 3',
                author: 'Author 3',
                url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
                likes: 6,
                __v: 0
            }
        )
    })
  })

  describe('mostBlogs', () => {
    const blogs = [
        {
          _id: '1',
          title: 'Understanding Node.js',
          author: 'Alice Johnson',
          url: 'https://example.com/node',
          likes: 7,
          __v: 0
        },
        {
          _id: '2',
          title: 'Mastering Express',
          author: 'Bob Smith',
          url: 'https://example.com/express',
          likes: 5,
          __v: 0
        },
        {
          _id: '3',
          title: 'MongoDB Tips',
          author: 'Alice Johnson',
          url: 'https://example.com/mongo',
          likes: 3,
          __v: 0
        },
        {
          _id: '4',
          title: 'Full Stack Best Practices',
          author: 'Charlie Lee',
          url: 'https://example.com/fullstack',
          likes: 10,
          __v: 0
        },
        {
          _id: '5',
          title: 'Async JavaScript',
          author: 'Alice Johnson',
          url: 'https://example.com/async',
          likes: 8,
          __v: 0
        }
      ]
      
    test('author with most blogs', () => {
        const result = listHelper.mostBlogs(blogs)
        assert.deepStrictEqual(
            result,
            {
                author: "Alice Johnson",
                blogs: 3
            }
        )
    })
  })