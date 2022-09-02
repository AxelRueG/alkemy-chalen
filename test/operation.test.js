const supertest = require('supertest')
const app = require('../app')
const API = supertest(app)
const DB = require('../models')

const userDefault1 = {
  username: 'user_def1',
  password: 'secureP455',
  email: 'user1@default.com',
}
const userDefault2 = {
  username: 'user_def2',
  password: 'passS3CUR3',
  email: 'user2@default.com',
}

const operations = [
  {
    title: 'operation 1',
    description: 'operation one description',
    pub_date: Date.now(),
    amount: 200,
  },
  {
    title: 'operation 2',
    description: 'operation two description',
    pub_date: Date.now(),
    amount: 50,
  },
  {
    title: 'operation 3',
    description: 'operation three description',
    pub_date: Date.now(),
    amount: 25,
  },
]

let u1 = undefined
let u2 = undefined

describe('operation create and get alls', () => {
  beforeEach(async () => {
    // clean DB
    await DB.query('DELETE FROM operation WHERE 1=1')
    await DB.query('DELETE FROM profile WHERE 1=1')

    // adding a pair of users
    await API.post('/v1/user').send(userDefault1)
    await API.post('/v1/user').send(userDefault2)

    // login users
    u1 = await API.post('/login').send({
      username: userDefault1.username,
      password: userDefault1.password,
    })
    u1 = u1.body
    u2 = await API.post('/login').send({
      username: userDefault2.username,
      password: userDefault2.password,
    })
    u2 = u2.body
  })

  test('when an user is logged can create a new operation', async () => {
    const response = await API.post('/v1/operations/')
      .set('Authorization', `Bearer ${u1.token}`)
      .send({ ...operations[0], categoryId: 4 })
      .expect(201)

    expect(response.body).toHaveProperty('id')
    expect(response.body.title).toBe(operations[0].title)
  })

  test('when an user has invalid credentials cannot create a new operation', async () => {
    const response = await API.post('/v1/operations/')
      .send({ ...operations[0], categoryId: 3 })
      .expect(401)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('invalid credentials')
  })

  // function to load some operations in the DB
  const loadOperations = async () => {
    await API.post('/v1/operations/')
      .send({ ...operations[0], categoryId: 4 })
      .set('Authorization', `Bearer ${u1.token}`)
    await API.post('/v1/operations/')
      .send({ ...operations[1], categoryId: 1 })
      .set('Authorization', `Bearer ${u2.token}`)
    await API.post('/v1/operations/')
      .send({ ...operations[2], categoryId: 2 })
      .set('Authorization', `Bearer ${u1.token}`)
  }

  // get method
  test('when an user is logged can get his operation list', async () => {
    await loadOperations()

    // try to get the operation of an user
    const response = await API.get('/v1/operations/')
      .set('Authorization', `Bearer ${u1.token}`)
      .expect(200)

    // the length==2 is because en loadOperations the operations are load in two users
    expect(response.body.length).toBe(2)
    expect(response.body[0].title).toBe(operations[0].title)
  })
  test('when an user has invalid credentials cannot see any operation', async () => {
    await loadOperations()
    // try to get the operation of an user
    const response = await API.get('/v1/operations/').expect(401)
    expect(response.body.message).toBe('invalid credentials')
  })
})
