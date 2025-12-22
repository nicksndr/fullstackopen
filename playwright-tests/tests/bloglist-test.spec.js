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
  })

})