const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

beforeEach(async () => {
  await Blog.deleteMany({})

  await new Blog(initialBlogs[0]).save()
  await new Blog(initialBlogs[1]).save()
  await new Blog(initialBlogs[2]).save()
  await new Blog(initialBlogs[3]).save()
  await new Blog(initialBlogs[4]).save()
  await new Blog(initialBlogs[5]).save()

})

describe('blogs api', () => {
  
  test('returns blogs as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('there are six blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body.length).toBe(6)
  })

  test('id to be defined', async () => {
    const response = await api.get('/api/blogs')
    
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  })

  test('new blog can be added via post', async () => {
    const blogToSave =  {
      title: "Testing save",
      author: "FullStack Testing",
      url: "https://https://fullstackopen.com/",
      likes: 10000,
    }

    // Check response first
    const response = await api.post('/api/blogs').send(blogToSave)
    expect(response.body.id).toBeDefined()

    // Check length has increased
    const getResponse = await api.get('/api/blogs')
    expect(getResponse.body.length).toBe(7)

    // Check that we do have our blog added
    const blogResponse = await Blog.find({'title': 'Testing save'})
      
    expect(blogResponse.length).toBe(1)
    expect(blogResponse[0]).toHaveProperty('title', 'Testing save')
    expect(blogResponse[0]).toHaveProperty('author', 'FullStack Testing')
    expect(blogResponse[0]).toHaveProperty('url', 'https://https://fullstackopen.com/')
    expect(blogResponse[0]).toHaveProperty('likes', 10000)

  })

  test('ensure likes is always set even none given (default 0)', async () => {
    const blogToSave =  {
      title: "Empty id test",
      author: "FullStack Testing",
      url: "https://https://fullstackopen.com/",
    }
    const response = await api.post('/api/blogs').send(blogToSave)
    expect(response.body.id).toBeDefined()

    // Check length has increased
    const getResponse = await api.get('/api/blogs')
    expect(getResponse.body.length).toBe(7)

     // Check that we do have our blog added
    const blogResponse = await Blog.find({'title': 'Empty id test'})
    expect(blogResponse.length).toBe(1)
    expect(blogResponse[0]).toHaveProperty('likes', 0)
  })

  test('return bad request when url or title is not given', async () => {
    const blogToSave =  {
      author: "FullStack Testing",
      likes: 10
    }
    const response = await api.post('/api/blogs').send(blogToSave)
    expect(response.status).toBe(400)
    
  })

  test('blog entry can be removed', async () => {
    const response = await api.delete('/api/blogs/5a422bc61b54a676234d17fc')
    expect(response.status).toBe(204)

    const getResponse = await api.get('/api/blogs')
    expect(getResponse.body.length).toBe(5)
   
  })
  
  test('blog entry can be updated', async () => {
    const newBlog = {
      title: "React patterns 2",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 50,
    }

    const response = await api
      .put('/api/blogs/5a422a851b54a676234d17f7')
      .send(newBlog)
    
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('title', 'React patterns 2')
    expect(response.body).toHaveProperty('likes', 50)   
  })
})

afterAll(() => {  
  mongoose.connection.close()
})