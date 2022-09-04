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

describe('update user data', () => {
  let User = undefined

  const userDef2 = {
    username: 'user2',
    password: 'password22',
    email: 'user2@mail.com',
  }

  beforeEach(async () => {
    // create a new user and login for get credentials
    await API.post('/v1/user').send(userDefault).expect(201)
    await API.post('/v1/user').send(userDef2).expect(201)
    User = await API.post('/login').send(userDefault).expect(200)
    User = User.body
  })
  // try to change the user name
  test('when a user is logged can change his username if the name isnt in use', async () => {
    const response = await API.put('/v1/user/username')
      .set('Authorization', `Bearer ${User.token}`)
      .send({ username: 'user_def' })
      .expect(201)

    expect(response.body.id).toBe(User.id)
    expect(response.body.username).toBe('user_def')
  })

  test('when a user is logged cannot change his username if the name is in use', async () => {
    const response = await API.put('/v1/user/username')
      .set('Authorization', `Bearer ${User.token}`)
      .send({ username: 'user2' })
      .expect(400)

    expect(response.body.message).toBe('invalid data')
  })

  test('when a user isnt logged cannot change his username returning message error', async () => {
    const response = await API.put('/v1/user/username')
      .send({ username: 'user_def' })
      .expect(401)

    console.log(response.body.message)
    expect(response.body.message).toBe('invalid credentials')
  })
})
