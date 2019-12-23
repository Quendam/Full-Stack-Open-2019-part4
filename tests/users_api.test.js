const mongoose = require('mongoose')
const User = require('../models/user')
const helper = require('../utils/test_helper')

const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', passwordHash: 'sekret' })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'taavi',
      name: 'Taavi Testaaja',
      password: 'asdf1234',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('user required to be unique', async () => {
    const newUser = {
      username: 'root',
      password: 'sekret',
    }

    const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

    expect(result.body.error).toContain('Error, expected `username` to be unique')
  })

  test('username must be atleast length of 3', async () => {
    const newUser = {
      username: 'te',
      password: 'sekret',
    }

    const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

    expect(result.body.error).toContain('shorter than the minimum allowed length (3)')
  })

  test('password must be atleast length of 3', async () => {
    const newUser = {
      username: 'taavi',
      password: 'se',
    }

    const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

    expect(result.body.error).toContain('Password not given or is too short')
  })
})

afterAll(() => {  
  mongoose.connection.close()
})