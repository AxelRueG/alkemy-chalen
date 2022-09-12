const supertest = require('supertest')
const app = require('../app')
const API = supertest(app)
const DB = require('../models')
const bcrypt = require('bcrypt')

const defaultUser = {
  username: 'user_def',
  password: 'secureP455',
  email: 'user@default.com',
}

beforeEach(async () => {
  // Cleaing DB
  await DB.query('DELETE FROM operation WHERE 1=1')
  await DB.query('DELETE FROM profile WHERE 1=1')

  // Insert a user
  const hash_password = await bcrypt.hash(defaultUser.password, 10)
  await DB.query(
    'INSERT INTO profile (username,userpassword,email,id_img) VALUES ($1,$2,$3,$4)',
    [defaultUser.username, hash_password, defaultUser.email, 1]
  )
})

describe('test user login', () => {
  test('when user login with corret credentials return a token', async () => {
    const response = await API.post('/login')
      .send({ username: defaultUser.username, password: defaultUser.password })
      .expect(200)
    expect(response.body).toHaveProperty('token')
  })

  test('when user login with invalid credentials return an error message', async () => {
    const response = await API.post('/login')
      .send({ username: defaultUser.username, password: 'incorect' })
      .expect(400)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('invalid credentials')
  })

  test('when user login with an ivalid user credentials return an error token', async () => {
    const response = await API.post('/login')
      .send({ username: 'unknow', password: 'secureP455' })
      .expect(400)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('invalid credentials')
  })
})
