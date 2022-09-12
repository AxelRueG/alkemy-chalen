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
    pub_date: new Date(),
    amount: 200,
  },
  {
    title: 'operation 2',
    description: 'operation two description',
    pub_date: new Date(),
    amount: 50,
  },
  {
    title: 'operation 3',
    description: 'operation three description',
    pub_date: new Date(),
    amount: 25,
  },
]

let u1 = undefined
let u2 = undefined

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

describe('create a new operation', () => {
  test('when an user is logged can create a new operation (income)', async () => {
    const response = await API.post('/v1/operations/')
      .set('Authorization', `Bearer ${u1.token}`)
      .send({ ...operations[0], id_category: 1 })
      .expect(201)

    expect(response.body).toHaveProperty('id')
    expect(response.body.title).toBe(operations[0].title)
    expect(response.body.amount).toBe(operations[0].amount)
  })

  test('when an user is logged can create a new operation (other)', async () => {
    const response = await API.post('/v1/operations/')
      .set('Authorization', `Bearer ${u1.token}`)
      .send({ ...operations[0], id_category: 4 })
      .expect(201)

    expect(response.body).toHaveProperty('id')
    expect(response.body.title).toBe(operations[0].title)
    expect(response.body.amount).toBe(-operations[0].amount)
  })

  test('when an user has invalid credentials cannot create a new operation', async () => {
    const response = await API.post('/v1/operations/')
      .send({ ...operations[0], id_category: 3 })
      .expect(401)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('invalid credentials')
  })
})

describe('get, update and delete operations', () => {
  beforeEach(async () => {
    // load some operations in the DB
    await API.post('/v1/operations/')
      .send({ ...operations[0], id_category: 1 })
      .set('Authorization', `Bearer ${u1.token}`)
    await API.post('/v1/operations/')
      .send({ ...operations[1], id_category: 3 })
      .set('Authorization', `Bearer ${u2.token}`)
    await API.post('/v1/operations/')
      .send({ ...operations[2], id_category: 2 })
      .set('Authorization', `Bearer ${u1.token}`)
  })

  // --- GET method ------------------------------------------------------------
  test('when an user is logged can get his operation list', async () => {
    // try to get the operation of an user
    const response = await API.get('/v1/operations/')
      .set('Authorization', `Bearer ${u1.token}`)
      .expect(200)

    // the length==2 is because en loadOperations the operations are load in two users
    expect(response.body).toHaveLength(2)
    expect(response.body[0].title).toBe(operations[0].title)
    expect(response.body[1].title).toBe(operations[2].title)
  })

  test('when an user has invalid credentials cannot see any operation', async () => {
    // try to get the operation of an user
    const response = await API.get('/v1/operations/').expect(401)
    expect(response.body.message).toBe('invalid credentials')
  })

  // --- UPDATE method ---------------------------------------------------------
  test('when the user is logged can edit an operation', async () => {
    const resOperations = await API.get('/v1/operations/')
      .set('Authorization', `Bearer ${u1.token}`)
      .expect(200)

    const response = await API.put(`/v1/operations/${resOperations.body[0].id}`)
      .set('Authorization', `Bearer ${u1.token}`)
      .send({ ...operations[0], id_category: 1 })
      .expect(201)

    expect(response.body.id).toBe(resOperations.body[0].id)
    expect(response.body.title).toBe(resOperations.body[0].title)
    expect(response.body.id_category).toBe(1)
  })

  test('when the user isnt logged cannot edit an operation', async () => {
    const resOperations = await API.get('/v1/operations/')
      .set('Authorization', `Bearer ${u1.token}`)
      .expect(200)

    const response = await API.put(`/v1/operations/${resOperations.body[0].id}`)
      .send({ ...operations[0], id_category: 1 })
      .expect(401)
    expect(response.body.message).toBe('invalid credentials')
  })

  test('when a user tries to edit a publication that is not theirs or not exist, return an empty array', async () => {
    const allOperations = await DB.query('SELECT id FROM operation')

    const response = await API.put(`/v1/operations/${allOperations.rows[1].id}`)
      .set('Authorization', `Bearer ${u1.token}`)
      .send({ ...operations[0], id_category: 1 })
      .expect(201)
    expect(response.body).toHaveLength(0)
  })

  // delete method -------------------------------------------------------------
  test('when the user is logged can delete an operation', async () => {
    const resOperations = await API.get('/v1/operations/')
      .set('Authorization', `Bearer ${u1.token}`)
      .expect(200)

    console.log(u1.token)
    const response = await API.delete(
      `/v1/operations/${resOperations.body[0].id}`
    )
      .set('Authorization', `Bearer ${u1.token}`)
      .expect(200)

    expect(response.body.message).toBe(`operation deleted`)
  })
  test('when the user isnt logged cannot delete an operation', async () => {
    const resOperations = await API.get('/v1/operations/')
      .set('Authorization', `Bearer ${u1.token}`)
      .expect(200)

    const response = await API.delete(
      `/v1/operations/${resOperations.body[0].id}`
    ).expect(401)

    expect(response.body.message).toBe('invalid credentials')
  })
  test('when a user tries to delete a operation that isnt their or dont exist, return empty object', async () => {
    const allOperations = await DB.query('SELECT id FROM operation')

    const response = await API.delete(
      `/v1/operations/${allOperations.rows[1].id}`
    )
      .set('Authorization', `Bearer ${u1.token}`)
      .expect(200)

    expect(response.body).toEqual({})
  })
})
