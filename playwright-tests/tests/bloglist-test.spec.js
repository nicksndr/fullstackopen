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
      
      // Then like it
      await page.getByRole('button', { name: 'remove' }).click()
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toBe('Are you sure?');
      await dialog.accept(); // clicks "OK"
      await expect(page.getByText('Test Blog')).not.toBeVisible()
    })
  })

})