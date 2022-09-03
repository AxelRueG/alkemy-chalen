const supertest = require('supertest')
const app = require('../app')
const API = supertest(app)
const DB = require('../models')

const userDefault = {
  username: 'user1',
  password: 'password22',
  email: 'usermail@mail.com',
}

beforeEach(async () => {
  // clean DB
  await DB.query('DELETE FROM operation WHERE 1=1')
  await DB.query('DELETE FROM profile WHERE 1=1')
})

describe('create a new user', () => {
  // USE CASES
  test('create an new valid user', async () => {
    const response = await API.post('/v1/user').send(userDefault).expect(201)
    const dbRows = await DB.query('SELECT id FROM profile')
    expect(dbRows.rowCount).toBe(1)
    expect(response.body).toHaveProperty('id')
    expect(response.body.username).toBe(userDefault.username)
  })

  test('create an user with an invalid password', async () => {
    const response = await API.post('/v1/user')
      .send({ ...userDefault, password: 'shot' })
      .expect(400)
    expect(response.body.message).toEqual('invalid data')
  })

  test('create an user with an used username', async () => {
    await API.post('/v1/user').send(userDefault).expect(201)
    const response = await API.post('/v1/user')
      .send({ ...userDefault, password: 'second password' })
      .expect(400)
    expect(response.body.message).toEqual('invalid data')
  })

  test('create an user with an invalid email', async () => {
    const response = await API.post('/v1/user')
      .send({ ...userDefault, email: '@mail.com' })
      .expect(400)
    expect(response.body.message).toEqual('invalid data')
  })
})
