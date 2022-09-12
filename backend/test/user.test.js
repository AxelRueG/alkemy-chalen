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

let User = undefined

const userDef2 = {
  username: 'user2',
  password: 'password22',
  email: 'user2@mail.com',
}

describe('update user data', () => {
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
  // try to change the password
  test('when a user is logged can change his password', async () => {
    const response = await API.put('/v1/user/password')
      .set('Authorization', `Bearer ${User.token}`)
      .send({
        oldpassword: userDefault.password,
        password1: 'secureP455',
        password2: 'secureP455',
      })
      .expect(201)

    expect(response.body.message).toBe('password changed')
  })

  test('when a user try change his password and the current password is icorrect, return an error message', async () => {
    const response = await API.put('/v1/user/password')
      .set('Authorization', `Bearer ${User.token}`)
      .send({
        oldpassword: undefined,
        password1: 'short',
        password2: 'short',
      })
      .expect(400)

    expect(response.body.message).toBe('invalid data')
  })

  test('when a user try change his password for an invalid, return an error message', async () => {
    const response = await API.put('/v1/user/password')
      .set('Authorization', `Bearer ${User.token}`)
      .send({
        oldpassword: userDefault.password,
        password1: 'short',
        password2: 'short',
      })
      .expect(400)

    expect(response.body.message).toBe('invalid data')
  })

  test('when a user try change his password and dont mach, return an error message', async () => {
    const response = await API.put('/v1/user/password')
      .set('Authorization', `Bearer ${User.token}`)
      .send({
        oldpassword: userDefault.password,
        password1: 'secureP455',
        password2: 'secureP456',
      })
      .expect(400)

    expect(response.body.message).toBe('invalid data')
  })

  test('when a user isnt logged cannot change his password returning message error', async () => {
    const response = await API.put('/v1/user/password')
      .send({
        oldpassword: userDefault.password,
        password1: 'secureP455',
        password2: 'secureP455',
      })
      .expect(401)

    expect(response.body.message).toBe('invalid credentials')
  })
})

describe('get user data', () => {
  beforeEach(async () => {
    // create a new user and login for get credentials
    await API.post('/v1/user').send(userDefault).expect(201)
    User = await API.post('/login').send(userDefault).expect(200)
    User = User.body

    const date = new Date()
    await DB.query(
      `
      INSERT INTO operation (id_profile,id_category,title,description,amount,pub_date)
      VALUES  ($1,4,'op1','description 1',200,$2),
              ($1,1,'op2','',-50,$2),
              ($1,2,'op3','description 2',-15,$2)
      `,
      [User.id, date]
    )
  })

  test('When a logged user consults their information, receive their data and their value account statement', async () => {
    const userResponse = await API.get('/v1/user')
      .set('Authorization', `Bearer ${User.token}`)
      .expect(200)
    expect(userResponse.body.id).toBe(User.id)
    expect(userResponse.body.summary).toBe(135)
  })
  test('When an unlogged user consults for information, receive an error message', async () => {
    const userResponse = await API.get('/v1/user').expect(401)
    expect(userResponse.body.message).toBe('invalid credentials')
  })
})
