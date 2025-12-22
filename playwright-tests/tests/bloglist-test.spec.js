const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'password123'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('Log in to application')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('wrong credentials')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })
  
    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel(/title/i).fill('Test Blog')
      await page.getByLabel(/author/i).fill('Test Author')
      await page.getByLabel(/url/i).fill('https://test.com')
      await page.getByRole('button', { name: 'Create' }).click()
      await expect(page.getByText('Test Blog')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      // First create a blog
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel(/title/i).fill('Test Blog')
      await page.getByLabel(/author/i).fill('Test Author')
      await page.getByLabel(/url/i).fill('https://test.com')
      await page.getByRole('button', { name: 'Create' }).click()
      await expect(page.getByText('Test Blog')).toBeVisible()
      
      // Then like it
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText(/likes 1/)).toBeVisible()
    })

    test('user who created blog can delete the blog', async ({ page }) => {
      // First create a blog
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel(/title/i).fill('Test Blog')
      await page.getByLabel(/author/i).fill('Test Author')
      await page.getByLabel(/url/i).fill('https://test.com')
      await page.getByRole('button', { name: 'Create' }).click()
      await expect(page.getByText('Test Blog')).toBeVisible()
      
      // Open the blog details
      await page.getByRole('button', { name: 'view' }).click()
      
      // Set up dialog handler before clicking remove
      page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm')
        expect(dialog.message()).toBe('Remove Test Blog by Test Author')
        await dialog.accept()
      })
      
      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByText('Test Blog')).not.toBeVisible()
    })

    test('only user who created the blog sees the delete button', async ({ page, request }) => {
      // First create a blog as mluukkai
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel(/title/i).fill('Test Blog')
      await page.getByLabel(/author/i).fill('Test Author')
      await page.getByLabel(/url/i).fill('https://test.com')
      await page.getByRole('button', { name: 'Create' }).click()
      await expect(page.getByText('Test Blog')).toBeVisible()
      
      // Verify the creator can see the remove button
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
      
      // Logout
      await page.getByRole('button', { name: 'logout' }).click()
      await expect(page.getByText('Log in to application')).toBeVisible()
      
      // Create a second user
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Another User',
          username: 'anotheruser',
          password: 'password123'
        }
      })
      
      // Login as the second user
      await page.getByLabel('username').fill('anotheruser')
      await page.getByLabel('password').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Another User logged in')).toBeVisible()
      
      // Verify the blog is still visible
      await expect(page.getByText('Test Blog')).toBeVisible()
      
      // Open the blog details
      await page.getByRole('button', { name: 'view' }).click()
      
      // Verify the remove button is NOT visible for the second user
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are arranged in order according to likes, most likes first', async ({ page }) => {
      // Create first blog
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel(/title/i).fill('Blog with 2 likes')
      await page.getByLabel(/author/i).fill('Author 1')
      await page.getByLabel(/url/i).fill('https://test1.com')
      await page.getByRole('button', { name: 'Create' }).click()
      await expect(page.getByText('Blog with 2 likes')).toBeVisible()

      // Create second blog
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel(/title/i).fill('Blog with 0 likes')
      await page.getByLabel(/author/i).fill('Author 2')
      await page.getByLabel(/url/i).fill('https://test2.com')
      await page.getByRole('button', { name: 'Create' }).click()
      await expect(page.getByText('Blog with 0 likes')).toBeVisible()

      // Create third blog
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel(/title/i).fill('Blog with 1 like')
      await page.getByLabel(/author/i).fill('Author 3')
      await page.getByLabel(/url/i).fill('https://test3.com')
      await page.getByRole('button', { name: 'Create' }).click()
      await expect(page.getByText('Blog with 1 like')).toBeVisible()

      // Like "Blog with 1 like" once - find it by title, open it, like it
      await page.getByText('Blog with 1 like').locator('..').getByRole('button', { name: 'view' }).first().click()
      await page.getByText('Blog with 1 like').locator('..').getByRole('button', { name: 'like' }).first().click()
      await expect(page.getByText(/likes 1/).first()).toBeVisible()
      
      // Like "Blog with 2 likes" twice
      await page.getByText('Blog with 2 likes').locator('..').getByRole('button', { name: 'view' }).first().click()
      // First like
      await page.getByText('Blog with 2 likes').locator('..').getByRole('button', { name: 'like' }).first().click()
      await page.waitForTimeout(300) // Wait for state update
      // Second like
      await page.getByText('Blog with 2 likes').locator('..').getByRole('button', { name: 'like' }).first().click()
      await expect(page.getByText(/likes 2/).first()).toBeVisible()

      // Wait for re-render after likes
      await page.waitForTimeout(1000)

      // Get all blog titles in the order they appear on the page
      // Use evaluate to get the order of blog titles from the DOM
      const blogOrder = await page.evaluate(() => {
        const blogs = Array.from(document.querySelectorAll('div[style*="border"]'))
        return blogs.map(blog => {
          const text = blog.textContent || ''
          if (text.includes('Blog with 2 likes')) return 'Blog with 2 likes'
          if (text.includes('Blog with 1 like')) return 'Blog with 1 like'
          if (text.includes('Blog with 0 likes')) return 'Blog with 0 likes'
          return null
        }).filter(Boolean)
      })

      // Verify the order: Blog with 2 likes, Blog with 1 like, Blog with 0 likes
      expect(blogOrder).toEqual(['Blog with 2 likes', 'Blog with 1 like', 'Blog with 0 likes'])
    })
  })

})